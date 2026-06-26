export interface ApiResponse<T = unknown> {
  success: boolean;

  statusCode: number;

  message: string;

  data?: T;

  errors?: unknown;
}
