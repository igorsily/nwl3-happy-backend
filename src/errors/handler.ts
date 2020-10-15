import { ErrorRequestHandler } from "express";
import { ValidationError } from "yup";

interface ValidationErrors {
  [key: string]: Array<string>;
}

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.log(error);

  if (error instanceof ValidationError) {
    let errors: ValidationErrors = {};

    error.inner.map((err) => {
      errors[err.path] = err.errors;
    });

    return response.status(400).json(errors);
  }

  return response.status(500).json({ message: "Internal server error" });
};

export default errorHandler;
