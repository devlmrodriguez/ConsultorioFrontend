import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { API_ROUTES } from "../constants/api-routes";
import { useCredentialsStore } from "../stores/credentials-store";
import { Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { axiosRequest } from "../utils/axios-helpers";
import { ErrorWithDetails } from "../models/api-error/error-with-details";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  const credentialsStore = useCredentialsStore();

  const query = useQuery<unknown, ErrorWithDetails>({
    queryKey: ["auth-check"],
    queryFn: () =>
      axiosRequest({
        url: API_ROUTES.AuthCheck,
        method: "GET",
      }),
    retry: (_, error) => {
      const isServerOfflineProbably = error.details.status === undefined;

      if (
        isServerOfflineProbably ||
        error.details.status === 401 ||
        error.details.status === 403
      ) {
        if (credentialsStore.credentials !== null) {
          console.debug(
            "Removing credentials in retry query due to auth-check failure",
          );
          credentialsStore.removeCredentials();
        }
      }

      return false;
    },
  });

  if (query.isError) {
    return <Navigate to="/login" />;
  }

  if (query.isPending) {
    return <Loader />;
  }

  return <Outlet />;
}
