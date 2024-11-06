import { ProblemDetails } from "./problem-details";
import { ValidationProblemDetails } from "./validation-problem-details";

export interface ErrorWithDetails extends Error {
  details: ProblemDetails | ValidationProblemDetails;
}
