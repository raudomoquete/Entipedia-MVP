'use client';

import React from 'react';
import { Button } from './button';
import { ApiError } from '@/lib/api-client';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      const error = this.state.error;
      const isApiError = error instanceof ApiError;

      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-red-900">Algo salió mal</h2>
            {isApiError ? (
              <div className="space-y-2">
                <p className="text-red-800">{error.problemDetails.title}</p>
                <p className="text-sm text-red-700">{error.problemDetails.detail}</p>
                {error.problemDetails.status && (
                  <p className="text-xs text-red-600">Código: {error.problemDetails.status}</p>
                )}
              </div>
            ) : (
              <p className="text-red-800">{error.message || 'Ocurrió un error inesperado'}</p>
            )}
            <Button onClick={this.handleReset} variant="outline" className="mt-4">
              Intentar de nuevo
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

