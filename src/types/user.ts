export interface UserRequest {
  fullName: string;
  cccd: string;
  email: string;
  phone: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  
  // Masked fields
  maskedCccd: string;
  maskedEmail: string;
  maskedPhone: string;
  
  // Clear fields (only for owner)
  cccd?: string;
  email?: string;
  phone?: string;
  
  role?: string;
  isOwner: boolean;
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
