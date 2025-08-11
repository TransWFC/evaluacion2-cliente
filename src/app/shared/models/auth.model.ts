import { User } from "./user.model";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  expires: Date;
  user: User;
}