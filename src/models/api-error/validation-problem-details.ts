import { ProblemDetails } from "./problem-details";

export interface ValidationProblemDetails extends ProblemDetails {
  errors: Record<string, string[]>;
}
