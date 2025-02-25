import { z } from "../../utils/es-zod";
import { leadStateSchema } from "../common/lead-state";

export const saveLeadHistoryDataSchema = z.object({
  notes: z.string().nonempty().optional().nullable(),
  state: leadStateSchema,
});

export const readLeadHistoryDataSchema = saveLeadHistoryDataSchema.extend({
  id: z.coerce.string().nonempty().uuid(),
  dateOfCreation: z.coerce.date(),
  creatorFirstName: z.string().optional().nullable(),
  creatorMiddleName: z.string().optional().nullable(),
  creatorLastName: z.string().optional().nullable(),
});

export type SaveLeadHistoryData = z.infer<typeof saveLeadHistoryDataSchema>;
export type ReadLeadHistoryData = z.infer<typeof readLeadHistoryDataSchema>;
