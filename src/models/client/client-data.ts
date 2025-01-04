import { z } from "../../utils/es-zod";
import { idDocumentTypeSchema } from "../common/id-document-type";

export const clientDataSchema = z.object({
  id: z.number().int().positive().optional(),
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  dateOfBirth: z.date(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  idDocumentType: idDocumentTypeSchema.optional(),
  idDocument: z.string().optional(),
  sex: z.string(),
  occupation: z.string().optional(),
  address: z.string(),
  howDidYouLearnAboutUs: z.string().optional(),
});

export type ClientData = z.infer<typeof clientDataSchema>;
