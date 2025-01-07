import { ErrorWithDetails } from "../models/api-error/error-with-details";
import { useQuery } from "@tanstack/react-query";
import { axiosRequest } from "../utils/axios-helpers";
import { ClientData, clientDataSchema } from "../models/client/client-data";
import { API_ROUTES } from "../constants/api-routes";

export const clientQueryKey = (clientId: string) => ["client", clientId];

export const useClientQuery = (clientId: string) => {
  const queryKey = clientQueryKey(clientId);

  const queryFn = () =>
    axiosRequest<ClientData>({
      url: `${API_ROUTES.Clients}/${clientId}`,
    }).then((response) => clientDataSchema.parse(response));

  const query = useQuery<ClientData, ErrorWithDetails>({
    queryKey: queryKey,
    queryFn: queryFn,
    retry: (failureCount, error) => {
      if (error.details.status === 401 || error.details.status === 403) {
        return false;
      }

      return failureCount < 2;
    },
  });

  return query;
};
