export type AppErrorType =
  | 'VALIDATION_ERROR'
  | 'EMAIL_ALREADY_EXISTS'
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'INVALID_RESET_CODE'
  | 'UNAUTHORIZED'
  | 'UNAUTHENTICATED'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';

type AppErrorProps = {
  type: AppErrorType;
  message: string;
  statusCode?: number;
  /** Campo do input a que o erro se refere (ex.: 'email'); vai em extensions.field. */
  field?: string;
};

export class AppError extends Error {
  readonly type: AppErrorType;
  readonly statusCode: number;
  readonly field?: string;

  constructor({ type, message, statusCode = 400, field }: AppErrorProps) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.field = field;
  }
}
