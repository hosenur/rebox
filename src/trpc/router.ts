import { procedure, router } from ".";
import { deployRouter } from "./routers/deploy";
import { projectRouter } from "./routers/project";
import { repositoryRouter } from "./routers/repositories";

export const appRouter = router({
  hello: procedure.query(() => {
    return {
      greeting: `Hello Hosenur!`,
      timestamp: new Date().toISOString(),
    };
  }),

  getUser: procedure.query(({ ctx }) => {
    return ctx.user;
  }),

  project: projectRouter,
  repository: repositoryRouter,
  deploy: deployRouter,
});

export type AppRouter = typeof appRouter;
