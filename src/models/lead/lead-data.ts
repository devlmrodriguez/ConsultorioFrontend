import { z } from "../../utils/es-zod";
import { leadSourceSchema } from "../common/lead-source";
import { leadStateSchema } from "../common/lead-state";
import { locationTypeSchema } from "../common/location-type";
import { createPagedListSchema } from "../common/paged-list";
import { readLeadHistoryDataSchema } from "./lead-history-data";

export const saveLeadDataSchema = z.object({
  phoneNumber: z.string().nonempty(),
  firstName: z.string().nonempty().optional().nullable(),
  middleName: z.string().nonempty().optional().nullable(),
  lastName: z.string().nonempty().optional().nullable(),
  email: z.string().nonempty().optional().nullable(),
  department: z.string().nonempty().optional().nullable(),
  province: z.string().nonempty().optional().nullable(),
  district: z.string().nonempty().optional().nullable(),
  source: leadSourceSchema.optional().nullable(),
  notes: z.string().nonempty().optional().nullable(),
  location: locationTypeSchema.optional().nullable(),
  state: leadStateSchema,
});

export const readLeadDataSchema = saveLeadDataSchema.extend({
  id: z.coerce.string().nonempty().uuid(),
  history: z.array(readLeadHistoryDataSchema),
  dateOfCreation: z.coerce.date(),
});

export type SaveLeadData = z.infer<typeof saveLeadDataSchema>;
export type ReadLeadData = z.infer<typeof readLeadDataSchema>;

export const pagedListReadLeadSchema =
  createPagedListSchema(readLeadDataSchema);
export type PagedListReadLeadData = z.infer<typeof pagedListReadLeadSchema>;
