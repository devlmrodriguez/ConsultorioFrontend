import { API_ROUTES } from "../constants/api-routes";
import {
  ReadPodiatryPreconditionData,
  SavePodiatryPreconditionData,
} from "../models/podiatry-precondition/podiatry-precondition-data";
import {
  useResourceCreateMutation,
  useResourceDeleteMutation,
  useResourceUpdateMutation,
} from "./common/resource-mutation-hook";
import { useResourceQuery } from "./common/resource-query-hook";
import { useResourcesQuery } from "./common/resources-query-hook";

export const podiatryPreconditionQueryKey = (
  podiatryPreconditionId: string,
) => ["podiatry-precondition", podiatryPreconditionId];

export const podiatryPreconditionsQueryKey = ["podiatry-preconditions"];

export const usePodiatryPreconditionCreateMutation = () =>
  useResourceCreateMutation<SavePodiatryPreconditionData>(
    API_ROUTES.PodiatryPreconditions,
    podiatryPreconditionsQueryKey,
  );

export const usePodiatryPreconditionUpdateMutation = (
  podiatryPreconditionId: string,
) =>
  useResourceUpdateMutation<SavePodiatryPreconditionData>(
    API_ROUTES.PodiatryPreconditions,
    podiatryPreconditionId,
    podiatryPreconditionQueryKey,
    podiatryPreconditionsQueryKey,
  );

export const usePodiatryPreconditionDeleteMutation = () =>
  useResourceDeleteMutation(
    API_ROUTES.PodiatryPreconditions,
    podiatryPreconditionQueryKey,
    podiatryPreconditionsQueryKey,
  );

export const usePodiatryPreconditionQuery = (podiatryPreconditionId: string) =>
  useResourceQuery<ReadPodiatryPreconditionData>(
    API_ROUTES.PodiatryPreconditions,
    podiatryPreconditionId,
    podiatryPreconditionQueryKey,
  );

export const usePodiatryPreconditionsQuery = () =>
  useResourcesQuery<ReadPodiatryPreconditionData>(
    API_ROUTES.PodiatryPreconditions,
    podiatryPreconditionsQueryKey,
  );
