import { ErrorWithDetails } from "../../models/api-error/error-with-details";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosRequest } from "../../utils/axios-helpers";

export function useResourcesQuery<TPagedListResourceData>(
  url: string,
  resourcesQueryKey: (string | number | undefined | object)[],
  searchTerm?: string,
  filters?: string,
  page?: number,
  pageSize?: number,
) {
  const queryKey = resourcesQueryKey;

  const queryFn = () =>
    axiosRequest<TPagedListResourceData>({
      url: url,
      params: {
        searchTerm,
        filters,
        page,
        pageSize,
      },
    });

  const query = useQuery<TPagedListResourceData, ErrorWithDetails>({
    queryKey: queryKey,
    queryFn: queryFn,
    placeholderData: keepPreviousData, // Better Paginated Queries
    retry: (failureCount, error) => {
      if (error.details.status === 401 || error.details.status === 403) {
        return false;
      }

      return failureCount < 2;
    },
  });

  return query;
}
