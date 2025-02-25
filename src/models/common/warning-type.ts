import { z } from "../../utils/es-zod";

export const warningTypeValues = ["Baja", "Media", "Alta"] as const;
export const warningTypeSchema = z.enum(warningTypeValues);
export type WarningType = z.infer<typeof warningTypeSchema>;
