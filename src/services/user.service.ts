import api from './api';
import type { UserRequest, UserResponse, PageResponse } from '../types/user';

export const userService = {
  // GET /api/users?page=0&size=10
  getUsersPaginated: async (page = 0, size = 10) => {
    const response = await api.get<PageResponse<UserResponse>>('/users', {
      params: { page, size, sort: 'id,desc' }
    });
    return response.data;
  },

  // GET /api/users/all
  getAllUsers: async () => {
    const response = await api.get<UserResponse[]>('/users/all');
    return response.data;
  },

  // POST /api/users (Admin ONLY)
  createUser: async (data: UserRequest) => {
    const response = await api.post<UserResponse>('/users', data);
    return response.data;
  }
};
