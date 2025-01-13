import { z } from "../../utils/es-zod";

export const savePodiatryPreconditionDataSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
});

export const readPodiatryPreconditionDataSchema =
  savePodiatryPreconditionDataSchema.extend({
    id: z.coerce.string().nonempty().uuid(),
  });

export type SavePodiatryPreconditionData = z.infer<
  typeof savePodiatryPreconditionDataSchema
>;
export type ReadPodiatryPreconditionData = z.infer<
  typeof readPodiatryPreconditionDataSchema
>;
