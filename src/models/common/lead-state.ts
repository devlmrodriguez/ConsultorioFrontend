import { z } from "../../utils/es-zod";

export const leadStateNewValue = "Nuevo";
export const leadStateContactedValue = "Contactado";
export const leadStateInterestedValue = "Interesado";
export const leadStateNotInterestedValue = "No interesado";

export const leadStateValues = [
  leadStateNewValue,
  leadStateContactedValue,
  leadStateInterestedValue,
  leadStateNotInterestedValue,
] as const;
export const leadStateSchema = z.enum(leadStateValues);
export type LeadState = z.infer<typeof leadStateSchema>;
