import { z } from "zod";
import { router, procedure } from "../index";
import { prisma } from "@/lib/prisma.server";
import { TRPCError } from "@trpc/server";
import { buildQueue } from "@/lib/queues/index.server";

export const projectRouter = router({
  // List all projects for the authenticated user
  list: procedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        repo: true,
        owner: true,
        path: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: `${project.owner}/${project.repo}`,
      repo: project.repo,
      owner: project.owner,
      path: project.path,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }));
  }),

  // Get a single project by ID
  getById: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.session?.user.id,
        },
        include: {
          deployments: {
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
            select: {
              id: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return {
        id: project.id,
        name: project.name,
        repo: project.repo,
        owner: project.owner,
        path: project.path,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        deployments: project.deployments.map((d) => ({
          id: d.id,
          status: d.status,
          createdAt: d.createdAt.toISOString(),
          updatedAt: d.updatedAt.toISOString(),
        })),
      };
    }),

  // Create a new project
  create: procedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is required"),
        repo: z.string().min(1, "Repository is required"),
        owner: z.string().min(1, "Owner is required"),
        path: z.string().default("/"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.create({
        data: {
          name: input.name,
          repo: input.repo,
          owner: input.owner,
          path: input.path,
          userId: ctx.session?.user.id,
        },
      });

      const deployment = await prisma.deployment.create({
        data: {
          projectId: project.id,
          status: "pending",
        },
      });

      await buildQueue.add(
        "build",
        {
          projectId: project.id,
          deploymentId: deployment.id,
          projectName: project.name,
          projectPath: project.path,
          userId: ctx.session?.user.id,
        },
        { delay: 3000 }
      );

      return {
        id: project.id,
        deploymentId: deployment.id,
      };
    }),

  // Update a project
  update: procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        repo: z.string().min(1).optional(),
        owner: z.string().min(1).optional(),
        path: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const existingProject = await prisma.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.session?.user.id,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const project = await prisma.project.update({
        where: { id: input.id },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.repo && { repo: input.repo }),
          ...(input.owner && { owner: input.owner }),
          ...(input.path && { path: input.path }),
        },
      });

      return {
        id: project.id,
        name: project.name,
        repo: project.repo,
        owner: project.owner,
        path: project.path,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      };
    }),

  // Delete a project
  delete: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const existingProject = await prisma.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.session?.user.id,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      await prisma.project.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
