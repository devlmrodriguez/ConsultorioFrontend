import { z } from "../../utils/es-zod";
import { leadSourceSchema } from "../common/lead-source";
import { leadStateSchema } from "../common/lead-state";
import { readLeadHistoryDataSchema } from "./lead-history-data";

export const saveLeadDataSchema = z.object({
  phoneNumber: z.string().nonempty(),
  firstName: z.string().nonempty().optional().nullable(),
  middleName: z.string().nonempty().optional().nullable(),
  lastName: z.string().nonempty().optional().nullable(),
  email: z.string().nonempty().optional().nullable(),
  source: leadSourceSchema.optional().nullable(),
  notes: z.string().nonempty().optional().nullable(),
  state: leadStateSchema,
});

export const readLeadDataSchema = saveLeadDataSchema.extend({
  id: z.coerce.string().nonempty().uuid(),
  history: z.array(readLeadHistoryDataSchema),
});

export type SaveLeadData = z.infer<typeof saveLeadDataSchema>;
export type ReadLeadData = z.infer<typeof readLeadDataSchema>;
