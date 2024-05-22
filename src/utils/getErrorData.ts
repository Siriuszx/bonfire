import { ValidationErrorSchema } from '@/types/ErrorData';
import { RouteErrorSchema } from '@/types/RouteError';

const defaultErrorMessage = 'Internal Server Error';

export const getErrorData = (
  error: unknown,
): { message: string; list?: string[] } => {
  const routeErrorParse = RouteErrorSchema.safeParse(error);
  if (routeErrorParse.success) {
    const errorData = routeErrorParse.data.data;
    return { message: errorData.error };
  }

  const validationErrorParse = ValidationErrorSchema.safeParse(error);
  if (validationErrorParse.success) {
    const errorData = validationErrorParse.data;
    return {
      message: errorData.data.message,
      list: errorData.data.errors?.map((e) => e.msg),
    };
  }

  return { message: defaultErrorMessage };
};
