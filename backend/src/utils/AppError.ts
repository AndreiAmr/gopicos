export type AppErrorType =
  | 'VALIDATION_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'UNAUTHENTICATED'
  | 'INTERNAL_ERROR';

type AppErrorProps = {
  type: AppErrorType;
  message: string;
  statusCode?: number;
};

export class AppError extends Error {
  readonly type: AppErrorType;
  readonly statusCode: number;

  constructor({ type, message, statusCode = 400 }: AppErrorProps) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
  }
}
