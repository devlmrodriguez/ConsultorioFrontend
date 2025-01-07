import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ROUTES } from "../constants/api-routes";
import { ErrorWithDetails } from "../models/api-error/error-with-details";
import { ClientData, clientDataSchema } from "../models/client/client-data";
import { axiosRequest } from "../utils/axios-helpers";
import { clientQueryKey } from "./client-query-hook";
import { clientsQueryKey } from "./clients-query-hook";

export const useClientCreateMutation = () => {
  const mutationFn = (clientData: ClientData) => {
    clientData = clientDataSchema.parse(clientData);
    return axiosRequest({
      url: API_ROUTES.Clients,
      method: "POST",
      data: clientData,
    });
  };

  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, ErrorWithDetails, ClientData>({
    mutationFn: mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: clientsQueryKey,
      });
    },
  });

  return mutation;
};

export const useClientUpdateMutation = (clientId: string) => {
  const mutationFn = (clientData: ClientData) => {
    clientData = clientDataSchema.parse(clientData);
    return axiosRequest({
      url: `${API_ROUTES.Clients}/${clientId}`,
      method: "PUT",
      data: clientData,
    });
  };

  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, ErrorWithDetails, ClientData>({
    mutationFn: mutationFn,
    onSuccess: () => {
      const queryKey = clientQueryKey(clientId);
      void queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: clientsQueryKey,
      });
    },
  });

  return mutation;
};

export const useClientDeleteMutation = () => {
  const mutationFn = (clientId: string) => {
    return axiosRequest({
      url: `${API_ROUTES.Clients}/${clientId}`,
      method: "DELETE",
    });
  };

  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, ErrorWithDetails, string>({
    mutationFn: mutationFn,
    onSuccess: (_, clientId) => {
      const queryKey = clientQueryKey(clientId);
      void queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: clientsQueryKey,
      });
    },
  });

  return mutation;
};
