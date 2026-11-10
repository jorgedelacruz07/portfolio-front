import { FC } from "react";
import { PageSkeleton } from "@/components/PageSkeleton";

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
}

/** Quiet inline loading state: plain text, no spinner or motion. */
export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  className,
  text = "Loading…",
}) => (
  <p
    role="status"
    className={["text-sm text-muted-foreground", className]
      .filter(Boolean)
      .join(" ")}
  >
    {text}
  </p>
);

/** Route fallback: mirrors page content while the lazy route module loads. */
export const PageLoader: FC<{ className?: string }> = ({ className }) => (
  <PageSkeleton className={className} />
);
