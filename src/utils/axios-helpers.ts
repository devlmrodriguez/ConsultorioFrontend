import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ProblemDetails } from "../models/api-error/problem-details";
import { ErrorWithDetails } from "../models/api-error/error-with-details";
import { ValidationProblemDetails } from "../models/api-error/validation-problem-details";
import { axiosInstance } from "./axios-setup";

export const axiosRequest = <TResponseData>(config: AxiosRequestConfig) => {
  const onSuccess = (response: AxiosResponse<TResponseData>) => {
    return response.data;
  };

  const onError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.data !== undefined && error.response.data !== "") {
        if (axios.isAxiosError<ProblemDetails>(error)) {
          const serverError: ErrorWithDetails = {
            name: "AxiosServerError",
            message: "AxiosServerError (ApiError)",
            details: error.response.data,
          };

          throw serverError;
        }

        if (axios.isAxiosError<ValidationProblemDetails>(error)) {
          const serverError: ErrorWithDetails = {
            name: "AxiosServerError",
            message: "AxiosServerError (ApiError)",
            details: error.response.data,
          };

          throw serverError;
        }

        const serverError: ErrorWithDetails = {
          name: "AxiosServerError",
          message: "AxiosServerError (Indeterminado)",
          details: {
            title: `Error remoto (${JSON.stringify(error.response.data)})`,
          },
        };

        throw serverError;
      }

      const unexpectedError: ErrorWithDetails = {
        name: "AxiosError",
        message: "AxiosError (Indeterminado)",
        details: {
          title: `Error inesperado (${error.message})`,
        },
      };

      console.debug(error);
      console.debug(unexpectedError);

      throw unexpectedError;
    }

    const unknownError: ErrorWithDetails = {
      name: "Error",
      message: "Error (Indeterminado)",
      details: {
        title: `Error indeterminado (${JSON.stringify(error)})`,
      },
    };

    console.debug(error);
    console.debug(unknownError);

    throw unknownError;
  };

  return axiosInstance(config).then(onSuccess).catch(onError);
};
