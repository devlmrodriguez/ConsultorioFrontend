import { createFileRoute } from "@tanstack/react-router";
import { ClientForm } from "../../../../components/client/ClientForm";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/clientes",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <ClientForm />;
}
