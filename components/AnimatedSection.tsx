import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "left" | "right" | "up" | "down";
  type?: "fade" | "slide" | "scale";
}

export const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
  direction = "left",
  type = "fade",
}: AnimatedSectionProps) => {
  const getInitialState = () => {
    switch (type) {
      case "slide":
        switch (direction) {
          case "left":
            return { opacity: 1, x: 0 };
          case "right":
            return { opacity: 1, x: 0 };
          case "up":
            return { opacity: 1, y: 0 };
          case "down":
            return { opacity: 1, y: 0 };
        }
      case "scale":
        return { opacity: 1, scale: 1 };
      default:
        return { opacity: 1 };
    }
  };

  const getAnimation = () => {
    switch (type) {
      case "slide":
        switch (direction) {
          case "left":
            return { x: [-20, 0], opacity: [0, 1] };
          case "right":
            return { x: [20, 0], opacity: [0, 1] };
          case "up":
            return { y: [20, 0], opacity: [0, 1] };
          case "down":
            return { y: [-20, 0], opacity: [0, 1] };
        }
      case "scale":
        return { scale: [0.8, 1], opacity: [0, 1] };
      default:
        return { opacity: [0, 1] };
    }
  };

  return (
    <motion.div
      initial={getInitialState()}
      animate={getAnimation()}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}; 