import { z } from "../../utils/es-zod";

export const savePodiatryReasonDataSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
});

export const readPodiatryReasonDataSchema = savePodiatryReasonDataSchema.extend(
  {
    id: z.coerce.string().nonempty().uuid(),
  },
);

export type SavePodiatryReasonData = z.infer<
  typeof savePodiatryReasonDataSchema
>;
export type ReadPodiatryReasonData = z.infer<
  typeof readPodiatryReasonDataSchema
>;
