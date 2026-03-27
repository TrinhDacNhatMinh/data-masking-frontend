export interface UserRequest {
  fullName: string;
  cccd: string;
  email: string;
  phone: string;
}

export interface UserResponse {
  fullName: string;
  maskedCccd: string;
  maskedEmail: string;
  maskedPhone: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  number: number;
}
