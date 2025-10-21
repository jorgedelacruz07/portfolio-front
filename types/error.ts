// Error types for better error handling
export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  url?: string;
  code?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: ApiError;
  retry?: () => void;
}

// Generic error response type
export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: Record<string, any>;
  };
}

// Network error type
export interface NetworkError extends Error {
  code?: string;
  status?: number;
  response?: {
    status: number;
    statusText: string;
    data?: any;
  };
}
