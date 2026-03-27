import axios from 'axios';
import type { UserRequest, UserResponse, PageResponse } from '../types/user';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/users',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  // GET /api/users?page=0&size=10
  getUsers: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<UserResponse>>('', {
      params: { page, size, sort: 'id,desc' }
    });
    return response.data;
  },

  // POST /api/users
  createUser: async (data: UserRequest) => {
    const response = await apiClient.post<UserResponse>('', data);
    return response.data;
  }
};
