const BASE_API_URL: string = import.meta.env.VITE_BASE_API_URL as string;

export const API_ROUTES = {
  AuthTenants: `${BASE_API_URL}/Auth/Tenants`,
  AuthLogin: `${BASE_API_URL}/Auth/Login`,
  AuthRefresh: `${BASE_API_URL}/Auth/Refresh`,
  AuthLogout: `${BASE_API_URL}/Auth/Logout`,
};
