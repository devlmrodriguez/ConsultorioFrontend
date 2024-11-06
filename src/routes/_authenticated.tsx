import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useApiQuery } from "../hooks/api-query.hook";
import { API_ROUTES } from "../constants/api-routes";
import { useUserStore } from "../stores/user-store";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUserStore().user;

  const queryEnabled = user !== null;

  // Very important to check for auth and automatically trigger interceptors in axios
  // Also, MUST ADD access token as the query key, otherwise previous unauthorized response gets cached
  const query = useApiQuery(
    API_ROUTES.AuthCheck,
    ["auth-check", user?.accessToken ?? ""],
    "GET",
    queryEnabled,
  );

  if (user === null || query.isError) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
