import DashboardNavbar from "@/components/dashboard/dashboard-navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { NavbarInset, NavbarProvider } from "@/components/ui/navbar";
import { Toast } from "@/components/ui/toast";
import {
    createRootRoute,
    HeadContent, Outlet,
    useRouter,
    type NavigateOptions,
    type ToOptions
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { RouterProvider } from "react-aria-components";
import "@/styles/app.css"
declare module "react-aria-components" {
  interface RouterConfig {
    href: ToOptions["to"];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}
const RootLayout = () => {
  const router = useRouter();

  return (
    <RouterProvider
      navigate={(to, options) => router.navigate({ to, ...options })}
    >
      <NavbarProvider>
        <HeadContent />
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <DashboardNavbar intent="inset" />
          <NavbarInset>
            <Outlet />
          </NavbarInset>
          <Toast richColors />
        </ThemeProvider>
        <TanStackRouterDevtools position="bottom-left" />
      </NavbarProvider>
    </RouterProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
