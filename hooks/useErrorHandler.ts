import { useCallback } from 'react';
import { ApiError } from '../types/error';

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown): ApiError => {
    // Handle different error types
    if (error instanceof Error) {
      return {
        message: error.message,
        code: error.name,
      };
    }

    if (typeof error === 'string') {
      return {
        message: error,
      };
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return {
        message: (error as any).message,
        status: (error as any).status,
        statusText: (error as any).statusText,
        url: (error as any).url,
        code: (error as any).code,
      };
    }

    return {
      message: 'An unknown error occurred',
    };
  }, []);

  const logError = useCallback((error: ApiError, context?: string) => {
    const errorInfo = {
      ...error,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };

    console.error('[Error Handler]', errorInfo);

    // Log to analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_map: {
          error_code: error.code || 'unknown',
          error_status: error.status?.toString() || 'unknown',
        },
      });
    }
  }, []);

  return {
    handleError,
    logError,
  };
};
