import { ErrorWithDetails } from "../models/api-error/error-with-details";
import { useMutation } from "@tanstack/react-query";
import { axiosRequest } from "../utils/axios-helpers";

export const useApiMutation = <TResponse, TRequest>(
  url: string,
  method?: string,
) => {
  const mutationFn = (request: TRequest) =>
    axiosRequest<TResponse>({
      url: url,
      method: method,
      data: request,
    });

  const mutation = useMutation<TResponse, ErrorWithDetails, TRequest>({
    mutationFn: mutationFn,
  });

  return mutation;
};
