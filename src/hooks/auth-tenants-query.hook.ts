import { useQuery } from "@tanstack/react-query";
import { AuthTenantsResponse } from "../models/auth-tenants-response";
import { ApiResponse } from "../models/api-response";
import { API_ROUTES } from "../constants/api-routes";

const fetchAuthTenants = async () => {
  const response = await fetch(API_ROUTES.AuthTenants);
  return response.json() as Promise<ApiResponse<AuthTenantsResponse>>;
};

export const useAuthTenantsQuery = () => {
  const query = useQuery({
    queryKey: ["auth-tenants"],
    queryFn: fetchAuthTenants,
  });

  return query;
};
