import { createError, defineHandler } from "nitro/h3";
import { auth } from "@/lib/auth.server";
import { prisma } from "@/lib/prisma.server";
import { Octokit } from "octokit";

export default defineHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
  });

  if (!account?.accessToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "GitHub account not linked",
    });
  }

  const octokit = new Octokit({ auth: account.accessToken });

  const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: "updated",
    per_page: 100,
  });

  const reposByOwner: Record<string, {
    id: number;
    name: string;
    fullName: string;
    description: string | null;
    private: boolean;
    url: string;
    stars: number;
    language: string | null;
    updatedAt: string | null;
  }[]> = {};

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
});
