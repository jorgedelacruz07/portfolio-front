import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn, homeMotion, homePageStyles } from "@/lib/utils";

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
    <motion.section
      id={id}
      className={cn(homePageStyles.section, className)}
      variants={homeMotion.section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="flex flex-col gap-3 border-b border-border/70 pb-3 sm:pb-4 sm:flex-row sm:items-end sm:justify-between">
        <motion.div
          className={homePageStyles.sectionHeader}
          variants={homeMotion.item}
        >
          <span className={homePageStyles.eyebrow}>{eyebrow}</span>
          <h2 className={homePageStyles.title}>{title}</h2>
          {description ? (
            <p className={homePageStyles.description}>{description}</p>
          ) : null}
        </motion.div>

        {actionHref ? (
          <motion.div variants={homeMotion.item} className="shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-mono text-xs hover:border-primary/40 hover:text-primary transition-all"
            >
              <Link to={actionHref} className="flex items-center gap-1.5">
                <span>{actionLabel}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </Button>
          </motion.div>
        ) : null}
      </div>

      <motion.div
        className={cn("pt-1", contentClassName)}
        variants={homeMotion.item}
      >
        {children}
      </motion.div>
    </motion.section>
  );
};
