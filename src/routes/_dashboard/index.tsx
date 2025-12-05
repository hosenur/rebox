import ProjectCard from "@/components/dashboard/project-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TextField } from "@/components/ui/text-field";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

export const cocktails = [
  { id: 1, name: "Project" },
  { id: 2, name: "Domain" },
  { id: 3, name: "App" },
];

export const Route = createFileRoute("/_dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery(trpc.project.list.queryOptions());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-fg">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-danger">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex w-full gap-2 mb-6">
        <div className="w-full">
          <TextField isRequired>
            <Input placeholder="Search" />
            <FieldError />
          </TextField>
        </div>
        <Select
          onChange={(d) => {
            navigate({ to: "/projects/new" });
          }}
          className={"w-min"}
          aria-label="Cocktails"
          placeholder="Choose your cocktail"
        >
          <SelectTrigger className="w-40" />
          <SelectContent items={cocktails}>
            {(item) => (
              <SelectItem id={item.id} textValue={item.name}>
                {item.name}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-fg">No projects found</p>
        </div>
      )}
    </div>
  );
}
