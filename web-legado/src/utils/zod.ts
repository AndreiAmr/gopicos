import { ZodError } from 'zod';

export const parseZodErrors = (error: ZodError) => {
  return error.issues.map((errorObj) => {
    return {
      field: errorObj.path[0].toString(),
      message: errorObj.message,
      code: errorObj.code,
    };
  });
};
