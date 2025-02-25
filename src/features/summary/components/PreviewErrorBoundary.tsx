import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PreviewErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Preview error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-destructive/5 rounded-lg border border-destructive/20 p-6">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold text-destructive mb-2">Preview Error</h3>
          <p className="text-destructive/80 text-center mb-4">
            {this.state.error?.message || 'An error occurred while rendering the preview'}
          </p>
          {this.props.onRetry && (
            <button
              onClick={this.props.onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Preview
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}