import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useSWR from "swr";

type Repo = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  url: string;
  stars: number;
  language: string | null;
  updatedAt: string;
};

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch repositories");
    return res.json();
  });
export const cocktails = [
  { id: 1, name: "Project" },
  { id: 2, name: "Domain" },
  { id: 3, name: "App" },
];
export const Route = createFileRoute("/_dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const {
    data: repos,
    error,
    isLoading,
  } = useSWR<Repo[]>("/api/repos", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-fg">Loading repositories...</p>
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

  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex w-full gap-2">
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
    </div>
  );
}
