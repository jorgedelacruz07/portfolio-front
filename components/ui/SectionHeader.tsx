import { memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import classNames from "classnames";

export interface SectionHeaderProps {
  /** Main title text (e.g., "Featured" or "Work") */
  title: string;
  /** Highlighted text shown in primary color (e.g., "Projects" or "Experience") */
  highlight: string;
  /** URL for the "View All" button */
  viewAllHref: string;
  /** Custom label for view all button (default: "View All") */
  viewAllLabel?: string;
  /** Whether the header is visible for animation purposes */
  isVisible?: boolean;
  /** Whether to apply entrance animation */
  animated?: boolean;
}

/**
 * Reusable section header component with title, highlight, and view all button.
 * Used consistently across HomeProjects and HomeExperiences sections.
 */
const SectionHeaderComponent = ({
  title,
  highlight,
  viewAllHref,
  viewAllLabel = "View All",
  isVisible = true,
  animated = false,
}: SectionHeaderProps) => {
  return (
    <div
      className={classNames(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-0",
        animated && "transition-all duration-1000",
        animated &&
          (isVisible
            ? "animate-fade-in-down"
            : "opacity-0 translate-y-[-30px]"),
      )}
    >
      <div className="flex items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          {title}{" "}
          <span className="relative inline-block">
            <span className="text-primary gradient-text relative z-10">
              {highlight}
            </span>
            <span
              className="text-primary gradient-text-alt absolute inset-0 animate-gradient-layer z-20"
              aria-hidden="true"
            >
              {highlight}
            </span>
          </span>
        </h2>
        <div className="ml-4 h-1 w-16 bg-primary animate-glow"></div>
      </div>
      <Button
        variant="ghost"
        className="text-primary hover:text-primary/80 font-semibold hover-scale"
        asChild
      >
        <Link href={viewAllHref}>{viewAllLabel}</Link>
      </Button>
    </div>
  );
};

SectionHeaderComponent.displayName = "SectionHeader";
export const SectionHeader = memo(SectionHeaderComponent);
