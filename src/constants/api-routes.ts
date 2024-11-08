export const BASE_API_URL = import.meta.env.VITE_BASE_BACKEND_API_URL as string;

export const API_ROUTES = {
  AuthTenants: "/Auth/Tenants",
  AuthLogin: "/Auth/Login",
  AuthRefresh: "/Auth/Refresh",
  AuthLogout: "/Auth/Logout",
  AuthCheck: "/Auth/Check",
  User: "/User",
};
