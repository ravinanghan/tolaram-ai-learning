import React, { Component, ReactNode, ErrorInfo } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from 'lucide-react';

interface RouteErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  routePath?: string;
}

interface RouteErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<{ error: Error; retry: () => void; goBack: () => void }> | undefined;
}

// Error fallback component
const DefaultRouteErrorFallback: React.FC<{
  error: Error;
  retry: () => void;
  goBack: () => void;
  routePath?: string | undefined;
}> = ({ error, retry, goBack, routePath }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full text-center"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="mx-auto mb-6 w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center"
          >
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </motion.div>

          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
            Page Loading Error
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            We couldn't load this page properly. This might be a temporary issue.
          </p>

          {routePath && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Route: {routePath}
            </p>
          )}

          <div className="space-y-3">
            <Button
              onClick={retry}
              variant="primary"
              fullWidth
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Try Again
            </Button>
            
            <div className="flex space-x-3">
              <Button
                onClick={goBack}
                variant="outline"
                fullWidth
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Go Back
              </Button>
              
              <Button
                onClick={() => window.location.href = '/dashboard'}
                variant="ghost"
                fullWidth
                icon={<Home className="w-4 h-4" />}
              >
                Dashboard
              </Button>
            </div>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Error Details (Development)
              </summary>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-800 dark:text-gray-200 overflow-auto max-h-32">
                <pre className="whitespace-pre-wrap">{error.toString()}</pre>
              </div>
            </details>
          )}
        </div>
      </motion.div>
    </div>
  );
};

class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): Partial<RouteErrorBoundaryState> {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
      routePath: window.location.pathname
    });
    
    // Log error for development
    if (process.env.NODE_ENV === 'development') {
      console.error('Route Error Boundary caught an error:', error, errorInfo);
    }
  }

  // Reset error state when route changes
  override componentDidUpdate(prevProps: RouteErrorBoundaryProps): void {
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  private handleGoBack = (): void => {
    window.history.back();
  };

  override render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return (
          <FallbackComponent
            error={this.state.error}
            retry={this.handleRetry}
            goBack={this.handleGoBack}
          />
        );
      }

      return (
        <DefaultRouteErrorFallback
          error={this.state.error}
          retry={this.handleRetry}
          goBack={this.handleGoBack}
          routePath={this.state.routePath}
        />
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping route components
export const withRouteErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallbackComponent?: React.ComponentType<{ error: Error; retry: () => void; goBack: () => void }> | undefined
) => {
  const WithRouteErrorBoundaryComponent = (props: P) => (
    <RouteErrorBoundary fallbackComponent={fallbackComponent}>
      <WrappedComponent {...props} />
    </RouteErrorBoundary>
  );

  WithRouteErrorBoundaryComponent.displayName = `withRouteErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithRouteErrorBoundaryComponent;
};

export default RouteErrorBoundary;