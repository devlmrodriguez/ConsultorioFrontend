import { z } from "../../utils/es-zod";

export const sexValues = ["Masculino", "Femenino"] as const;
export const sexSchema = z.enum(sexValues);
export type Sex = z.infer<typeof sexSchema>;
