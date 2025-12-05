# Agent Guidelines for Rebox

## Commands
- **Development**: `bun dev` - Start dev server
- **Build**: `bun build` - Production build
- **Preview**: `bun preview` - Preview production build
- **Database**: `bun db:generate`, `bun db:migrate`, `bun db:push`, `bun db:studio`
- **Single test**: `bun test <file>` (configure vitest first)

## Code Style
- **TypeScript + React**: Use strict typing, `React.FC` for components, proper interfaces
- **Imports**: Use path aliases `@/*` for src, group imports (external → internal → local)
- **Components**: Follow shadcn/ui patterns, use React Aria primitives, `"use client"` for client components
- **Styling**: TailwindCSS with CSS variables, use `tailwind-variants` for component variants
- **API**: Use tRPC with proper error handling and authentication middleware
- **Database**: Prisma ORM with proper migrations, use SQLite by default
- **Files**: kebab-case for files, PascalCase for components, camelCase for variables/functions
- **Error Handling**: Use `TRPCError` with proper codes, handle loading states with React Query
- **Data Fetching**: Always use React Query syntax: `const { data: projects, isLoading, error } = useQuery(trpc.project.list.queryOptions());`
- **UI Patterns**: Consistent with existing design system, responsive grid layouts, proper ARIA labels

## Architecture
- **Routes**: File-based routing with TanStack Router, `/src/routes/*` structure
- **State**: React Query for data fetching and mutations
- **Auth**: Better Auth with GitHub OAuth, protect all procedures with session checks