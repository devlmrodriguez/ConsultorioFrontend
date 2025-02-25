import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorWithDetails } from "../../models/api-error/error-with-details";
import { axiosRequest } from "../../utils/axios-helpers";

export function useResourceCreateMutation<TSaveResourceData>(
  url: string,
  resourcesQueryKey: (string | number | undefined)[],
) {
  const mutationFn = (saveResourceData: TSaveResourceData) => {
    return axiosRequest({
      url: url,
      method: "POST",
      data: saveResourceData,
    });
  };

  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, ErrorWithDetails, TSaveResourceData>({
    mutationFn: mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: resourcesQueryKey,
      });
    },
  });

  return mutation;
}

export function useResourceUpdateMutation<TSaveResourceData>(
  url: string,
  resourceId: string,
  resourceQueryKey: (resouceId: string) => string[],
  resourcesQueryKey: (string | number | undefined)[],
) {
  const mutationFn = (saveResourceData: TSaveResourceData) => {
    return axiosRequest({
      url: `${url}/${resourceId}`,
      method: "PUT",
      data: saveResourceData,
    });
  };

  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, ErrorWithDetails, TSaveResourceData>({
    mutationFn: mutationFn,
    onSuccess: () => {
      const queryKey = resourceQueryKey(resourceId);
      void queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: resourcesQueryKey,
      });
    },
  });

  return mutation;
}

export function useResourceDeleteMutation(
  url: string,
  resourceQueryKey: (resouceId: string) => string[],
  resourcesQueryKey: (string | number | undefined)[],
) {
  const mutationFn = (resourceId: string) => {
    return axiosRequest({
      url: `${url}/${resourceId}`,
      method: "DELETE",
    });
  };

  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, ErrorWithDetails, string>({
    mutationFn: mutationFn,
    onSuccess: (_, resourceId) => {
      const queryKey = resourceQueryKey(resourceId);
      void queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: resourcesQueryKey,
      });
    },
  });

  return mutation;
}
