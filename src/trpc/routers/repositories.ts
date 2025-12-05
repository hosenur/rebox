import { procedure, router } from "@/trpc";
import { HTTPError } from "nitro/deps/h3";
import { Octokit } from "octokit";

export const repositoryRouter = router({
  // List all projects for the authenticated user
  list: procedure.query(async ({ ctx }) => {
    const account = await ctx.prisma.account.findFirst({
      where: {
        userId: ctx.session?.user.id,
        providerId: "github",
      },
    });

    if (!account?.accessToken) {
      throw new HTTPError({
        statusCode: 400,
        statusMessage: "GitHub account not linked",
      });
    }
    const octokit = new Octokit({ auth: account.accessToken });
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 100,
    });
    const reposByOwner: Record<
      string,
      {
        id: number;
        name: string;
        fullName: string;
        description: string | null;
        private: boolean;
        url: string;
        stars: number;
        language: string | null;
        updatedAt: string | null;
      }[]
    > = {};

    for (const repo of repos) {
      const owner = repo.owner.login;
      if (!reposByOwner[owner]) {
        reposByOwner[owner] = [];
      }
      reposByOwner[owner].push({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        private: repo.private,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        updatedAt: repo.updated_at,
      });
    }

    return reposByOwner;
  }),
});
