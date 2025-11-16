/**
 * Application constants
 */
export const APP_CONFIG = {
  name: 'Entipedia',
  description: 'Entipedia MVP',
  version: '1.0.0',
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  apiVersion: 'v1',
} as const;

/**
 * Storage keys (for future use, not auth-related)
 */
export const STORAGE_KEYS = {
  // Add storage keys here when needed (without auth for now)
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  home: '/',
  projects: '/projects',
  clients: '/clients',
  files: '/files',
} as const;

