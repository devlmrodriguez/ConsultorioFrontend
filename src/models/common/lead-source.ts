import { z } from "../../utils/es-zod";

export const leadSourceValues = ["Facebook", "Instagram", "GoogleAds"] as const;
export const leadSourceSchema = z.enum(leadSourceValues);
export type LeadSource = z.infer<typeof leadSourceSchema>;
