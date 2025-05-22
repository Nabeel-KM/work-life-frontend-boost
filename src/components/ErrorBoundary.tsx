
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from "sonner";

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8" role="alert" aria-live="assertive">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" aria-hidden="true" />
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <div className="flex gap-4">
        <Button 
          onClick={resetErrorBoundary}
          variant="outline"
        >
          Try again
        </Button>
        <Button 
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </div>
    </div>
  );
};

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<FallbackProps>;
  onReset?: () => void;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Call onError prop if provided
    this.props.onError?.(error, errorInfo);
    
    // Show error toast for better UX
    toast("Application Error", {
      description: "An error occurred. Our team has been notified.",
      // Remove the variant property as it's not supported in the ExternalToast type
    });
  }

  resetErrorBoundary() {
    this.props.onReset?.();
    this.setState({ hasError: false, error: undefined });
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || ErrorFallback;
      return <FallbackComponent
        error={this.state.error as Error}
        resetErrorBoundary={this.resetErrorBoundary}
      />;
    }

    return this.props.children;
  }
}
