export interface AuthLogoutRequest {
  tenantId: string;
  userId: string;
  refreshToken: string;
}
