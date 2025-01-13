import { ErrorWithDetails } from "../../models/api-error/error-with-details";
import { useQuery } from "@tanstack/react-query";
import { axiosRequest } from "../../utils/axios-helpers";

export function useResourceQuery<TReadResourceData>(
  url: string,
  resourceId: string,
  resourceQueryKey: (resouceId: string) => string[],
) {
  const queryKey = resourceQueryKey(resourceId);

  const queryFn = () =>
    axiosRequest<TReadResourceData>({
      url: `${url}/${resourceId}`,
    });

  const query = useQuery<TReadResourceData, ErrorWithDetails>({
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
}
