import { useMutation } from "@tanstack/react-query";
import { API_ROUTES } from "../constants/api-routes";
import {
  CheckLegacyCodeData,
  PagedListReadClientData,
  ReadClientData,
  SaveClientData,
} from "../models/client/client-data";
import { axiosRequest } from "../utils/axios-helpers";
import {
  useResourceCreateMutation,
  useResourceDeleteMutation,
  useResourceUpdateMutation,
} from "./common/resource-mutation-hook";
import { useResourceQuery } from "./common/resource-query-hook";
import { useResourcesQuery } from "./common/resources-query-hook";
import { ErrorWithDetails } from "../models/api-error/error-with-details";

export const clientQueryKey = (clientId: string) => ["client", clientId];

export const clientsQueryKey = (
  searchTerm?: string,
  filters?: string,
  page?: number,
  pageSize?: number,
) => ["clients", searchTerm, filters, page, pageSize];

export const useClientCreateMutation = () =>
  useResourceCreateMutation<SaveClientData>(API_ROUTES.Clients, [
    "clients",
    "list",
  ]);

export const useClientUpdateMutation = (clientId: string) =>
  useResourceUpdateMutation<SaveClientData>(
    API_ROUTES.Clients,
    clientId,
    (clientId: string) => ["clients", "detail", clientId],
    ["clients", "list"],
  );

export const useClientDeleteMutation = () =>
  useResourceDeleteMutation(
    API_ROUTES.Clients,
    (clientId: string) => ["clients", "detail", clientId],
    ["clients", "list"],
  );

export const useClientQuery = (clientId: string) =>
  useResourceQuery<ReadClientData>(
    API_ROUTES.Clients,
    clientId,
    (clientId: string) => ["clients", "detail", clientId],
  );

export const useCheckLegacyCodeMutation = () => {
  const mutationFn = (legacyCode?: number | null) => {
    return axiosRequest<CheckLegacyCodeData>({
      url: `${API_ROUTES.Clients}/check-legacy-code/${legacyCode ? legacyCode.toString() : ""}`,
      method: "GET",
    });
  };

  const mutation = useMutation<
    CheckLegacyCodeData,
    ErrorWithDetails,
    number | null | undefined
  >({
    mutationFn: mutationFn,
  });

  return mutation;
};

export const useClientsQuery = (
  searchTerm?: string,
  filters?: string,
  page?: number,
  pageSize?: number,
) =>
  useResourcesQuery<PagedListReadClientData>(
    API_ROUTES.Clients,
    ["clients", "list", { searchTerm, filters, page, pageSize }],
    searchTerm,
    filters,
    page,
    pageSize,
  );
