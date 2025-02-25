import { z } from "../../utils/es-zod";
import { idDocumentTypeSchema } from "../common/id-document-type";
import { locationTypeSchema } from "../common/location-type";
import { createPagedListSchema } from "../common/paged-list";
import { warningTypeSchema } from "../common/warning-type";
import {
  readClientRepresentativeDataSchema,
  saveClientRepresentativeDataSchema,
} from "./client-representative-data";

export const saveClientDataSchema = z.object({
  legacyCode: z.number().int().optional().nullable(),
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
  department: z.string().nonempty().optional().nullable(),
  province: z.string().nonempty().optional().nullable(),
  district: z.string().nonempty().optional().nullable(),
  address: z.string().nonempty(),
  location: locationTypeSchema.optional().nullable(),
  howDidYouLearnAboutUs: z.string().nonempty().optional().nullable(),
  warningType: warningTypeSchema.optional().nullable(),
  warning: z.string().nonempty().optional().nullable(),
  representative: saveClientRepresentativeDataSchema.optional().nullable(),
  isPatient: z.boolean().optional().nullable(),
});

export const readClientDataSchema = saveClientDataSchema.extend({
  id: z.coerce.string().nonempty().uuid(),
  representative: readClientRepresentativeDataSchema.optional().nullable(),
  dateOfCreation: z.coerce.date(),
});

export const checkLegacyCodeDataSchema = z.object({
  legacyCode: z.number().int(),
  exists: z.boolean(),
});

export type SaveClientData = z.infer<typeof saveClientDataSchema>;
export type ReadClientData = z.infer<typeof readClientDataSchema>;
export type CheckLegacyCodeData = z.infer<typeof checkLegacyCodeDataSchema>;

export const pagedListReadClientSchema =
  createPagedListSchema(readClientDataSchema);
export type PagedListReadClientData = z.infer<typeof pagedListReadClientSchema>;
