import { Link } from "@tanstack/react-router";

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  updatedAt: string;
};

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="block rounded-lg border border-border bg-bg p-4 transition-colors hover:bg-secondary/50"
    >
      <h3 className="font-semibold text-fg">{project.name}</h3>
      {project.description && (
        <p className="mt-1 text-sm text-muted-fg line-clamp-2">
          {project.description}
        </p>
      )}
      <p className="mt-2 text-xs text-muted-fg">
        Updated {new Date(project.updatedAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
