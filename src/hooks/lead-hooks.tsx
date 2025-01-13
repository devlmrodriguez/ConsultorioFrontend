import { API_ROUTES } from "../constants/api-routes";
import { ReadLeadData, SaveLeadData } from "../models/lead/lead-data";
import {
  useResourceCreateMutation,
  useResourceDeleteMutation,
  useResourceUpdateMutation,
} from "./common/resource-mutation-hook";
import { useResourceQuery } from "./common/resource-query-hook";
import { useResourcesQuery } from "./common/resources-query-hook";

export const leadQueryKey = (leadId: string) => ["lead", leadId];

export const leadsQueryKey = ["leads"];

export const useLeadCreateMutation = () =>
  useResourceCreateMutation<SaveLeadData>(API_ROUTES.Leads, leadsQueryKey);

export const useLeadUpdateMutation = (leadId: string) =>
  useResourceUpdateMutation<SaveLeadData>(
    API_ROUTES.Leads,
    leadId,
    leadQueryKey,
    leadsQueryKey,
  );

export const useLeadDeleteMutation = () =>
  useResourceDeleteMutation(API_ROUTES.Leads, leadQueryKey, leadsQueryKey);

export const useLeadQuery = (leadId: string) =>
  useResourceQuery<ReadLeadData>(API_ROUTES.Leads, leadId, leadQueryKey);

export const useLeadsQuery = () =>
  useResourcesQuery<ReadLeadData>(API_ROUTES.Leads, leadsQueryKey);
