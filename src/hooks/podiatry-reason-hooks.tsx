import { API_ROUTES } from "../constants/api-routes";
import {
  ReadPodiatryReasonData,
  SavePodiatryReasonData,
} from "../models/podiatry-reason/podiatry-reason-data";
import {
  useResourceCreateMutation,
  useResourceDeleteMutation,
  useResourceUpdateMutation,
} from "./common/resource-mutation-hook";
import { useResourceQuery } from "./common/resource-query-hook";
import { useResourcesQuery } from "./common/resources-query-hook";

export const podiatryReasonQueryKey = (podiatryReasonId: string) => [
  "podiatry-reason",
  podiatryReasonId,
];

export const podiatryReasonsQueryKey = ["podiatry-reasons"];

export const usePodiatryReasonCreateMutation = () =>
  useResourceCreateMutation<SavePodiatryReasonData>(
    API_ROUTES.PodiatryReasons,
    podiatryReasonsQueryKey,
  );

export const usePodiatryReasonUpdateMutation = (podiatryReasonId: string) =>
  useResourceUpdateMutation<SavePodiatryReasonData>(
    API_ROUTES.PodiatryReasons,
    podiatryReasonId,
    podiatryReasonQueryKey,
    podiatryReasonsQueryKey,
  );

export const usePodiatryReasonDeleteMutation = () =>
  useResourceDeleteMutation(
    API_ROUTES.PodiatryReasons,
    podiatryReasonQueryKey,
    podiatryReasonsQueryKey,
  );

export const usePodiatryReasonQuery = (podiatryReasonId: string) =>
  useResourceQuery<ReadPodiatryReasonData>(
    API_ROUTES.PodiatryReasons,
    podiatryReasonId,
    podiatryReasonQueryKey,
  );

export const usePodiatryReasonsQuery = () =>
  useResourcesQuery<ReadPodiatryReasonData>(
    API_ROUTES.PodiatryReasons,
    podiatryReasonsQueryKey,
  );
