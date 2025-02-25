import { API_ROUTES } from "../constants/api-routes";
import {
  PagedListReadLeadData,
  ReadLeadData,
  SaveLeadData,
} from "../models/lead/lead-data";
import {
  useResourceCreateMutation,
  useResourceDeleteMutation,
  useResourceUpdateMutation,
} from "./common/resource-mutation-hook";
import { useResourceQuery } from "./common/resource-query-hook";
import { useResourcesQuery } from "./common/resources-query-hook";

export const leadQueryKey = (leadId: string) => ["leads", "detail", leadId];

export const leadsQueryKey = (
  searchTerm?: string,
  filters?: string,
  page?: number,
  pageSize?: number,
) => ["leads", searchTerm, filters, page, pageSize];

export const useLeadCreateMutation = () =>
  useResourceCreateMutation<SaveLeadData>(API_ROUTES.Leads, ["leads", "list"]);

export const useLeadUpdateMutation = (leadId: string) =>
  useResourceUpdateMutation<SaveLeadData>(
    API_ROUTES.Leads,
    leadId,
    (leadId: string) => ["leads", "detail", leadId],
    ["leads", "list"],
  );

export const useLeadDeleteMutation = () =>
  useResourceDeleteMutation(
    API_ROUTES.Leads,
    (leadId: string) => ["leads", "detail", leadId],
    ["leads", "list"],
  );

export const useLeadQuery = (leadId: string) =>
  useResourceQuery<ReadLeadData>(API_ROUTES.Leads, leadId, (leadId: string) => [
    "leads",
    "detail",
    leadId,
  ]);

export const useLeadsQuery = (
  searchTerm?: string,
  filters?: string,
  page?: number,
  pageSize?: number,
) =>
  useResourcesQuery<PagedListReadLeadData>(
    API_ROUTES.Leads,
    ["leads", "list", { searchTerm, filters, page, pageSize }],
    searchTerm,
    filters,
    page,
    pageSize,
  );
