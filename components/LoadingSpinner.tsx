import { FC, useEffect, useState } from "react";
import classNames from "classnames";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
  text = "Loading...",
}) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={classNames(
        "flex flex-col items-center justify-center space-y-4",
        className,
      )}
    >
      <div className="relative">
        {/* Outer ring */}
        <div
          className={classNames(
            "border-4 border-primary/20 rounded-full animate-spin",
            sizeClasses[size],
          )}
        />

        {/* Inner ring */}
        <div
          className={classNames(
            "absolute top-0 left-0 border-4 border-transparent border-t-primary rounded-full animate-spin",
            sizeClasses[size],
          )}
          style={{ animationDuration: "0.8s" }}
        />

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
        </div>
      </div>

      {text && (
        <div className="text-muted-foreground text-sm font-medium">
          {text}
          {dots}
        </div>
      )}
    </div>
  );
};

// Skeleton loading components
export const SkeletonCard: FC<{ className?: string }> = ({ className }) => (
  <div className={classNames("animate-pulse", className)}>
    <div className="bg-muted rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-muted-foreground/20 rounded-lg" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
          <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted-foreground/20 rounded w-full" />
        <div className="h-3 bg-muted-foreground/20 rounded w-5/6" />
        <div className="h-3 bg-muted-foreground/20 rounded w-4/6" />
      </div>
      <div className="flex space-x-2">
        <div className="h-6 bg-muted-foreground/20 rounded w-16" />
        <div className="h-6 bg-muted-foreground/20 rounded w-20" />
        <div className="h-6 bg-muted-foreground/20 rounded w-14" />
      </div>
    </div>
  </div>
);

export const SkeletonText: FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => (
  <div className={classNames("animate-pulse space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={classNames(
          "h-4 bg-muted-foreground/20 rounded",
          i === lines - 1 ? "w-3/4" : "w-full",
        )}
      />
    ))}
  </div>
);

export const SkeletonAvatar: FC<{ size?: number; className?: string }> = ({
  size = 40,
  className,
}) => (
  <div
    className={classNames(
      "animate-pulse bg-muted-foreground/20 rounded-full",
      className,
    )}
    style={{ width: size, height: size }}
  />
);

// Progressive loading component
export const ProgressiveLoader: FC<{
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}> = ({ isLoading, children, fallback, className }) => {
  const [showContent, setShowContent] = useState(!isLoading);

  useEffect(() => {
    if (!isLoading) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isLoading]);

  if (isLoading || !showContent) {
    return (
      <div className={classNames("transition-opacity duration-300", className)}>
        {fallback || <LoadingSpinner />}
      </div>
    );
  }

  return (
    <div className={classNames("transition-opacity duration-300", className)}>
      {children}
    </div>
  );
};

// Page loading component
export const PageLoader: FC<{ className?: string }> = ({ className }) => (
  <div
    className={classNames(
      "min-h-screen flex items-center justify-center bg-background",
      className,
    )}
  >
    <div className="text-center space-y-6">
      <div className="relative">
        {/* Animated logo or brand */}
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-primary rounded-full animate-pulse" />
        </div>

        {/* Floating particles */}
        <div className="absolute -top-2 -left-2 w-2 h-2 bg-primary/30 rounded-full animate-float" />
        <div className="absolute -top-1 -right-3 w-1 h-1 bg-primary/40 rounded-full animate-float-slow" />
        <div className="absolute -bottom-2 -right-1 w-1.5 h-1.5 bg-primary/25 rounded-full animate-float-reverse" />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          Loading Portfolio
        </h2>
        <LoadingSpinner size="sm" text="Preparing your experience" />
      </div>
    </div>
  </div>
);
