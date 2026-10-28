import { FC } from "react";

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
}

/** Quiet inline loading state: plain text, no spinner or motion. */
export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ className, text = "Loading…" }) => (
  <p role="status" className={["text-sm text-muted-foreground", className].filter(Boolean).join(" ")}>
    {text}
  </p>
);

/** Route fallback: reserves the page area so the layout does not jump, without drawing a loader. */
export const PageLoader: FC<{ className?: string }> = ({ className }) => (
  <div className={["min-h-[60vh]", className].filter(Boolean).join(" ")} aria-busy="true" />
);
