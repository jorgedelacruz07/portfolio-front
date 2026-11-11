import React, { Component, ErrorInfo, ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Log error to analytics if available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "exception", {
        description: error.message,
        fatal: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[50vh] items-center justify-center px-4 py-16">
          <div className="w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-6">
            <h3 className="text-base font-semibold text-foreground">Something went wrong</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {import.meta.env.DEV && this.state.error ? (
              <p className="font-mono text-xs text-destructive">{this.state.error.message}</p>
            ) : null}
            <Button type="button" onClick={() => window.location.reload()}>
              Refresh page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = ErrorBoundaryComponent;
