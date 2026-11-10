import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, homePageStyles } from "@/lib/utils";

type HomeSectionProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  actionHref?: string;
  actionLabel?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  id?: string;
  index?: string;
};

export const HomeSection = ({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel = "View all",
  children,
  className,
  contentClassName,
  id,
}: HomeSectionProps) => {
  return (
    <section id={id} className={cn(homePageStyles.section, className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-5 sm:items-end sm:justify-between">
        <div className={homePageStyles.sectionHeader}>
          <p className={homePageStyles.eyebrow}>
            <span>{eyebrow}</span>
          </p>
          <h2 className={homePageStyles.title}>{title}</h2>
          {description ? (
            <p className={homePageStyles.description}>{description}</p>
          ) : null}
        </div>

        {actionHref ? (
          <div className="shrink-0">
            <Button asChild variant="outline" size="sm">
              <Link to={actionHref} className="group flex items-center gap-2">
                <span>{actionLabel}</span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>

      <div className={cn("pt-1 sm:pt-3", contentClassName)}>{children}</div>
    </section>
  );
};
