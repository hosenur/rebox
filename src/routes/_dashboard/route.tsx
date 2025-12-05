import DashboardNavbar from "@/components/dashboard/dashboard-navbar";
import { NavbarInset } from "@/components/ui/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardNavbar intent="inset" />
      <NavbarInset>
        <Outlet />
      </NavbarInset>
    </>
  );
}
