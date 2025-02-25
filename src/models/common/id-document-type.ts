import { z } from "../../utils/es-zod";

export const idDocumentTypeValues = ["DNI", "CE", "Pasaporte"] as const;
export const idDocumentTypeSchema = z.enum(idDocumentTypeValues);
export type IdDocumentType = z.infer<typeof idDocumentTypeSchema>;
