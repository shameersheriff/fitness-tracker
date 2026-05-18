import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled application error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-cloud p-6 text-ink dark:bg-[#121816] dark:text-white">
          <div className="max-w-md rounded-lg bg-white p-6 shadow-soft dark:bg-white/10">
            <h1 className="text-xl font-bold">Something needs attention</h1>
            <p className="mt-2 text-sm text-ink/65 dark:text-white/65">
              Refresh the page or retry the last action.
            </p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
