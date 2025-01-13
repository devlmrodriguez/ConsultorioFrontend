import { z } from "../../utils/es-zod";

export const saveClientRepresentativeDataSchema = z.object({
  relation: z.string().nonempty(),
  fullName: z.string().nonempty(),
  phoneNumber: z.string().nonempty().optional().nullable(),
  email: z.string().email().nonempty().optional().nullable(),
  address: z.string().nonempty().optional().nullable(),
});

export const readClientRepresentativeDataSchema =
  saveClientRepresentativeDataSchema.extend({
    id: z.coerce.string().nonempty().uuid(),
  });

export type SaveClientRepresentativeData = z.infer<
  typeof saveClientRepresentativeDataSchema
>;
export type ReadClientRepresentativeData = z.infer<
  typeof readClientRepresentativeDataSchema
>;
