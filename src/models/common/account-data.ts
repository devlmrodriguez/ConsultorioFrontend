import { z } from "../../utils/es-zod";

export const accountDataSchema = z.object({
  email: z.string().nonempty().email(),
  firstName: z.string().nonempty(),
  middleName: z.string().nonempty().optional().nullable(),
  lastName: z.string().nonempty(),
});

export type AccountData = z.infer<typeof accountDataSchema>;
