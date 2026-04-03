import api from './api';
import type { LoginRequest, RegisterRequest, JwtResponse, MessageResponse } from '../types/auth';

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await api.post<JwtResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post<MessageResponse>('/auth/register', data);
    return response.data;
  }
};
