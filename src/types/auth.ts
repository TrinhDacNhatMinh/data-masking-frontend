export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  cccd: string;
  phone: string;
}

export interface JwtResponse {
  accessToken: string;
  tokenType: string;
  email: string;
  role: string;
}

export interface MessageResponse {
  message: string;
}
