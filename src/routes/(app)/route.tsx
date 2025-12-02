import { Header } from "@/components/header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header />
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 pt-4 pb-6">
        <Outlet />
      </div>
    </div>
  );
}
