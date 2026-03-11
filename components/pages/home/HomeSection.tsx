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
    <motion.section
      className={cn(homePageStyles.section, className)}
      variants={homeMotion.section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className={homePageStyles.sectionSurface}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.18),transparent_34%)] opacity-80" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className={homePageStyles.sectionHeader}>
          <motion.div
            className={homePageStyles.sectionCopy}
            variants={homeMotion.item}
          >
            <p className={homePageStyles.eyebrow}>{eyebrow}</p>
            <h2 className={homePageStyles.title}>{title}</h2>
            {description ? (
              <p className={homePageStyles.description}>{description}</p>
            ) : null}
          </motion.div>

          {actionHref ? (
            <motion.div variants={homeMotion.item}>
              <Button
                asChild
                variant="outline"
                className="h-12 px-6 text-sm font-semibold"
              >
                <Link to={actionHref}>{actionLabel}</Link>
              </Button>
            </motion.div>
          ) : null}
        </div>

        <motion.div
          className={cn(homePageStyles.sectionContent, contentClassName)}
          variants={homeMotion.item}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};
