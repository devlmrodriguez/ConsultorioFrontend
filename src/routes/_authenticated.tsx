import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useApiQuery } from "../hooks/api-query.hook";
import { API_ROUTES } from "../constants/api-routes";
import { useCredentialsStore } from "../stores/credentials-store";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  const credentialsStore = useCredentialsStore();

  const queryEnabled = credentialsStore.credentials !== null;

  // Very important to check for auth and automatically trigger interceptors in axios
  // Also, MUST ADD access token as the query key, otherwise previous unauthorized response gets cached
  const query = useApiQuery(
    API_ROUTES.AuthCheck,
    ["auth-check", credentialsStore.credentials?.accessToken ?? ""],
    "GET",
    queryEnabled,
  );

  if (query.isError) {
    credentialsStore.removeCredentials();
  }

  if (credentialsStore.credentials === null || query.isError) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
