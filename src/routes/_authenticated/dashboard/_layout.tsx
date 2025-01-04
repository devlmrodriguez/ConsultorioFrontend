import { createFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { Shell } from "../../../components/common/Shell/Shell";

export const Route = createFileRoute("/_authenticated/dashboard/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Helmet>
        <title>Consultorio | Dashboard</title>
      </Helmet>

      <Shell />
    </>
  );
}
