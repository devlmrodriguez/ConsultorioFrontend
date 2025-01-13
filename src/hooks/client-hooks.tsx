import { API_ROUTES } from "../constants/api-routes";
import { ReadClientData, SaveClientData } from "../models/client/client-data";
import {
  useResourceCreateMutation,
  useResourceDeleteMutation,
  useResourceUpdateMutation,
} from "./common/resource-mutation-hook";
import { useResourceQuery } from "./common/resource-query-hook";
import { useResourcesQuery } from "./common/resources-query-hook";

export const clientQueryKey = (clientId: string) => ["client", clientId];

export const clientsQueryKey = ["clients"];

export const useClientCreateMutation = () =>
  useResourceCreateMutation<SaveClientData>(
    API_ROUTES.Clients,
    clientsQueryKey,
  );

export const useClientUpdateMutation = (clientId: string) =>
  useResourceUpdateMutation<SaveClientData>(
    API_ROUTES.Clients,
    clientId,
    clientQueryKey,
    clientsQueryKey,
  );

export const useClientDeleteMutation = () =>
  useResourceDeleteMutation(
    API_ROUTES.Clients,
    clientQueryKey,
    clientsQueryKey,
  );

export const useClientQuery = (clientId: string) =>
  useResourceQuery<ReadClientData>(
    API_ROUTES.Clients,
    clientId,
    clientQueryKey,
  );

export const useClientsQuery = () =>
  useResourcesQuery<ReadClientData>(API_ROUTES.Clients, clientsQueryKey);
