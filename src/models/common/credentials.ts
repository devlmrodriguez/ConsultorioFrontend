import { z } from "../../utils/es-zod";

export const credentialsSchema = z.object({
  tenantId: z.coerce.string().nonempty().uuid(),
  userId: z.coerce.string().nonempty().uuid(),
  accessToken: z.string().nonempty(),
  refreshToken: z.string().nonempty(),
});

export type Credentials = z.infer<typeof credentialsSchema>;
