import { z } from "../../utils/es-zod";

export const locationTypeValues = [
  "Domicilio",
  "Consultorio",
  "Híbrido",
] as const;
export const locationTypeSchema = z.enum(locationTypeValues);
export type LocationType = z.infer<typeof locationTypeSchema>;
