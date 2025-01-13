import { z } from "../../utils/es-zod";
import { idDocumentTypeSchema } from "../common/id-document-type";
import {
  readClientRepresentativeDataSchema,
  saveClientRepresentativeDataSchema,
} from "./client-representative-data";

export const saveClientDataSchema = z.object({
  firstName: z.string().nonempty(),
  middleName: z.string().nonempty().optional().nullable(),
  lastName: z.string().nonempty(),
  dateOfBirth: z.coerce.date(),
  phoneNumber: z.string().nonempty().optional().nullable(),
  email: z.string().nonempty().email().optional().nullable(),
  idDocumentType: idDocumentTypeSchema.optional().nullable(),
  idDocument: z.string().nonempty().optional().nullable(),
  sex: z.string().nonempty(),
  occupation: z.string().nonempty().optional().nullable(),
  address: z.string().nonempty(),
  howDidYouLearnAboutUs: z.string().nonempty().optional().nullable(),
  representative: saveClientRepresentativeDataSchema.optional().nullable(),
  isPatient: z.boolean().optional().nullable(),
});

export const readClientDataSchema = saveClientDataSchema.extend({
  id: z.coerce.string().nonempty().uuid(),
  representative: readClientRepresentativeDataSchema.optional().nullable(),
});

export type SaveClientData = z.infer<typeof saveClientDataSchema>;
export type ReadClientData = z.infer<typeof readClientDataSchema>;
