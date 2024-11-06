import { ErrorWithDetails } from "../models/api-error/error-with-details";
import { useQuery } from "@tanstack/react-query";
import { axiosRequest } from "../utils/axios-helpers";

export const useApiQuery = <TResponse,>(
  url: string,
  queryKey: string[],
  method?: string,
  enabled = true,
) => {
  const queryFn = () =>
    axiosRequest<TResponse>({
      url: url,
      method: method,
    });

  const query = useQuery<TResponse, ErrorWithDetails>({
    queryKey: queryKey,
    queryFn: queryFn,
    retry: (failureCount, error) => {
      if (error.details.status === 401 || error.details.status === 403) {
        return false;
      }

      return failureCount < 2;
    },
    enabled: enabled,
  });

  return query;
};
