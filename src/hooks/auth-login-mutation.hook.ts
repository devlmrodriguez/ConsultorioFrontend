import { useMutation } from "@tanstack/react-query";
import { ApiResponse } from "../models/api-response";
import { AuthLoginRequest } from "../models/auth-login-request";
import { AuthLoginResponse } from "../models/auth-login-response";
import { API_ROUTES } from "../constants/api-routes";

const fetchAuthLogin = async (request: AuthLoginRequest) => {
  const response = await fetch(API_ROUTES.AuthLogin, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(request),
  });

  return response.json() as Promise<ApiResponse<AuthLoginResponse>>;
};

export const useAuthLoginMutation = () => {
  const mutation = useMutation({
    mutationFn: fetchAuthLogin,
  });

  return mutation;
};
