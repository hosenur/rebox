import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

interface Props {
  appearance?: "plain" | "outline";
}

export function ThemeSwitcher({ appearance = "plain" }: Props) {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      intent={appearance}
      size="sq-sm"
      aria-label="Switch theme"
      onPress={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
