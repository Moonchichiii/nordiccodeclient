import { AxiosError } from 'axios';

export class ProjectError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ProjectError';
  }

  static fromApiError(error: unknown): ProjectError {
    if (error instanceof AxiosError) {
      return new ProjectError(
        error.response?.data?.message || 'API Error',
        error.response?.data?.code || 'UNKNOWN_ERROR',
        error.response?.status || 500
      );
    }
    return new ProjectError('Unknown error', 'UNKNOWN_ERROR', 500);
  }
}