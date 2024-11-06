import { ErrorWithDetails } from "../models/api-error/error-with-details";
import { ValidationProblemDetails } from "../models/api-error/validation-problem-details";

export function formatApiError(apiError: ErrorWithDetails) {
  const errorList: string[] = [];
  const details = apiError.details;
  const validationProblemDetails = details as ValidationProblemDetails;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (validationProblemDetails.errors !== undefined) {
    for (const key in validationProblemDetails.errors) {
      const errorMessages = validationProblemDetails.errors[key];
      errorMessages.forEach((errorMessage) => {
        errorList.push(`${key}: ${errorMessage}`);
      });
    }

    return errorList;
  }

  // Single error message
  errorList.push(apiError.details.title);
  return errorList;
}
