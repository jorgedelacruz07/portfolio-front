import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn, homePageStyles } from "@/lib/utils";

type HomeSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
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
}: HomeSectionProps) => {
  return (
    <section className={cn(homePageStyles.section, className)}>
      <div className={homePageStyles.sectionSurface}>
        <div className={homePageStyles.sectionHeader}>
          <div className={homePageStyles.sectionCopy}>
            <p className={homePageStyles.eyebrow}>{eyebrow}</p>
            <h2 className={homePageStyles.title}>{title}</h2>
            {description ? (
              <p className={homePageStyles.description}>{description}</p>
            ) : null}
          </div>

          {actionHref ? (
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-border bg-background/80 px-5 text-sm font-semibold"
            >
              <Link to={actionHref}>{actionLabel}</Link>
            </Button>
          ) : null}
        </div>

        <div className={cn(homePageStyles.sectionContent, contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
};
