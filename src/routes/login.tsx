import { createFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { Login } from "../components/common/Login/Login";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Helmet>
        <title>Consultorio | Login</title>
      </Helmet>

      <Login />
    </>
  );
}
