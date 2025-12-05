import { z } from "zod";
import { router, procedure } from "../index";
import { prisma } from "@/lib/prisma.server";
import { buildQueue } from "@/lib/queues/index.server";
import { TRPCError } from "@trpc/server";

// Helper to verify deployment ownership
async function verifyDeploymentOwnership(deploymentId: string, userId: string) {
  const deployment = await prisma.deployment.findUnique({
    where: { id: deploymentId },
    include: {
      project: true,
    },
  });

  if (!deployment) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Deployment not found",
    });
  }

  if (deployment.project.userId !== userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to this deployment",
    });
  }

  return deployment;
}

export const deployRouter = router({
  // List all deployments for a project
  list: procedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify project ownership
      const project = await prisma.project.findFirst({
        where: {
          id: input.projectId,
          userId: ctx.session?.user.id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const deployments = await prisma.deployment.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
          imageName: true,
          containerName: true,
          port: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return deployments.map((deployment) => ({
        id: deployment.id,
        status: deployment.status,
        imageName: deployment.imageName,
        containerName: deployment.containerName,
        port: deployment.port,
        createdAt: deployment.createdAt.toISOString(),
        updatedAt: deployment.updatedAt.toISOString(),
      }));
    }),

  // Get a single deployment by ID
  getById: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const deployment = await verifyDeploymentOwnership(
        input.id,
        ctx.session?.user.id
      );

      return {
        id: deployment.id,
        projectId: deployment.projectId,
        status: deployment.status,
        buildJobId: deployment.buildJobId,
        deployJobId: deployment.deployJobId,
        imageName: deployment.imageName,
        containerName: deployment.containerName,
        port: deployment.port,
        createdAt: deployment.createdAt.toISOString(),
        updatedAt: deployment.updatedAt.toISOString(),
        project: {
          id: deployment.project.id,
          name: deployment.project.name,
          repo: deployment.project.repo,
          owner: deployment.project.owner,
        },
      };
    }),

  // Create a new deployment (triggers build and deploy)
  create: procedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify project ownership
      const project = await prisma.project.findFirst({
        where: {
          id: input.projectId,
          userId: ctx.session?.user.id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      // Create deployment record
      const deployment = await prisma.deployment.create({
        data: {
          projectId: project.id,
          status: "pending",
        },
      });

      // Add to build queue
      await buildQueue.add("build", {
        projectId: project.id,
        deploymentId: deployment.id,
        projectName: project.name,
        projectPath: project.path,
        userId: user.id,
      });

      return {
        id: deployment.id,
        projectId: deployment.projectId,
        status: deployment.status,
        createdAt: deployment.createdAt.toISOString(),
        updatedAt: deployment.updatedAt.toISOString(),
      };
    }),

  // Get build logs for a deployment
  getBuildLogs: procedure
    .input(z.object({ deploymentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = getAuthenticatedUser(ctx);
      const deployment = await verifyDeploymentOwnership(
        input.deploymentId,
        user.id
      );

      const logs = await prisma.buildLog.findMany({
        where: { deploymentId: input.deploymentId },
        orderBy: { line: "asc" },
      });

      return {
        deploymentId: deployment.id,
        status: deployment.status,
        logs: logs.map((log) => ({
          line: log.line,
          message: log.message,
          createdAt: log.createdAt.toISOString(),
        })),
      };
    }),

  // Get deploy logs for a deployment
  getDeployLogs: procedure
    .input(z.object({ deploymentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = getAuthenticatedUser(ctx);
      const deployment = await verifyDeploymentOwnership(
        input.deploymentId,
        user.id
      );

      const logs = await prisma.deployLog.findMany({
        where: { deploymentId: input.deploymentId },
        orderBy: { line: "asc" },
      });

      return {
        deploymentId: deployment.id,
        status: deployment.status,
        logs: logs.map((log) => ({
          line: log.line,
          message: log.message,
          createdAt: log.createdAt.toISOString(),
        })),
      };
    }),

  // Cancel a deployment (if it's pending or building)
  cancel: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = getAuthenticatedUser(ctx);
      const deployment = await verifyDeploymentOwnership(input.id, user.id);

      if (!["pending", "building"].includes(deployment.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can only cancel pending or building deployments",
        });
      }

      await prisma.deployment.update({
        where: { id: input.id },
        data: { status: "cancelled" },
      });

      return { success: true };
    }),

  // Redeploy an existing deployment
  redeploy: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = getAuthenticatedUser(ctx);
      const existingDeployment = await verifyDeploymentOwnership(
        input.id,
        user.id
      );

      // Create a new deployment for the same project
      const deployment = await prisma.deployment.create({
        data: {
          projectId: existingDeployment.projectId,
          status: "pending",
        },
      });

      // Add to build queue
      await buildQueue.add("build", {
        projectId: existingDeployment.project.id,
        deploymentId: deployment.id,
        projectName: existingDeployment.project.name,
        projectPath: existingDeployment.project.path,
        userId: user.id,
      });

      return {
        id: deployment.id,
        projectId: deployment.projectId,
        status: deployment.status,
        createdAt: deployment.createdAt.toISOString(),
        updatedAt: deployment.updatedAt.toISOString(),
      };
    }),

  // Delete a deployment
  delete: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = getAuthenticatedUser(ctx);
      await verifyDeploymentOwnership(input.id, user.id);

      // Delete the deployment (cascades to logs)
      await prisma.deployment.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
