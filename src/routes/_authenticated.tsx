import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useApiQuery } from "../hooks/api-query.hook";
import { API_ROUTES } from "../constants/api-routes";
import { useUserCredentialsStore } from "../stores/user-credentials-store";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  const userCredentialsStore = useUserCredentialsStore();
  const userCredentials = userCredentialsStore.userCredentials;
  const removeCredentials = userCredentialsStore.removeCredentials;

  const queryEnabled = userCredentialsStore.userCredentials !== null;

  // Very important to check for auth and automatically trigger interceptors in axios
  // Also, MUST ADD access token as the query key, otherwise previous unauthorized response gets cached
  const query = useApiQuery(
    API_ROUTES.AuthCheck,
    ["auth-check", userCredentials?.accessToken ?? ""],
    "GET",
    queryEnabled,
  );

  if (query.isError) {
    removeCredentials();
  }

  if (userCredentials === null || query.isError) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
