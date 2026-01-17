import React, { useEffect, useState } from "react";
import classNames from "classnames";

interface CursorEffectProps {
  className?: string;
  enabled?: boolean;
}

export const CursorEffect: React.FC<CursorEffectProps> = ({
  className,
  enabled = true,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    const handleMouseOut = () => {
      setIsVisible(false);
    };

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select',
    );

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [enabled]);

  if (!enabled || !isVisible) return null;

  return (
    <>
      {/* Main cursor */}
      <div
        className={classNames(
          "fixed top-0 left-0 w-4 h-4 bg-primary/20 rounded-full pointer-events-none z-50 transition-all duration-300 ease-out",
          isHovering && "scale-150 bg-primary/40",
          className,
        )}
        style={{
          transform: `translate(${mousePosition.x - 8}px, ${mousePosition.y - 8}px)`,
        }}
      />

      {/* Trailing cursor */}
      <div
        className={classNames(
          "fixed top-0 left-0 w-8 h-8 border border-primary/30 rounded-full pointer-events-none z-40 transition-all duration-500 ease-out",
          isHovering && "scale-75 border-primary/50",
        )}
        style={{
          transform: `translate(${mousePosition.x - 16}px, ${mousePosition.y - 16}px)`,
        }}
      />

      {/* Outer ring */}
      <div
        className={classNames(
          "fixed top-0 left-0 w-12 h-12 border border-primary/10 rounded-full pointer-events-none z-30 transition-all duration-700 ease-out",
          isHovering && "scale-50 border-primary/20",
        )}
        style={{
          transform: `translate(${mousePosition.x - 24}px, ${mousePosition.y - 24}px)`,
        }}
      />
    </>
  );
};

// Text reveal effect component
interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.6,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={classNames(
        "transition-all ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className,
      )}
      style={{ transitionDuration: `${duration}s` }}
    >
      {children}
    </div>
  );
};

// Magnetic effect component
interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  className,
  strength = 0.3,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      className={classNames(
        "transition-transform duration-300 ease-out",
        className,
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// Glitch effect component
interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  children,
  className,
  intensity = 0.1,
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100);
      },
      3000 + Math.random() * 2000,
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={classNames(
        "relative inline-block transition-all duration-100",
        isGlitching && "animate-pulse",
        className,
      )}
      style={{
        textShadow: isGlitching
          ? `
            ${intensity}px 0 0 #ff0000,
            -${intensity}px 0 0 #00ffff,
            ${intensity * 2}px 0 0 #ff00ff
          `
          : "none",
        transform: isGlitching
          ? `translate(${intensity}px, 0)`
          : "translate(0, 0)",
      }}
    >
      {children}
    </span>
  );
};
