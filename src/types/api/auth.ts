export interface AuthErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface AuthMeResponse {
  username: string;
  name?: string;
  email?: string;
  userId?: string;
  pw?: string;
}
