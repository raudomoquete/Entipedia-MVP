import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ProblemDetails } from '@/types/api';

/**
 * Custom API Error that includes ProblemDetails from backend
 */
export class ApiError extends Error {
  public readonly problemDetails: ProblemDetails;
  public readonly statusCode: number;

  constructor(problemDetails: ProblemDetails, statusCode: number) {
    super(problemDetails.detail || 'An error occurred');
    this.name = 'ApiError';
    this.problemDetails = problemDetails;
    this.statusCode = statusCode;
  }
}

/**
 * API Client configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Creates and configures an Axios instance
 */
export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // TODO: Add auth token here when authentication is implemented
      // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Convert ProblemDetails to ApiError
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ProblemDetails>) => {
      if (error.response?.data) {
        const problemDetails = error.response.data;
        throw new ApiError(problemDetails, error.response.status);
      }

      // Network or other errors
      const fallbackProblemDetails: ProblemDetails = {
        type: 'NETWORK_ERROR',
        title: 'Network Error',
        status: 0,
        detail: error.message || 'A network error occurred',
      };
      throw new ApiError(fallbackProblemDetails, 0);
    }
  );

  return client;
}

/**
 * Default API client instance
 */
export const apiClient = createApiClient();

/**
 * Type-safe API request helper
 */
export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
}

