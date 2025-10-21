import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ParticleEffectProps {
  className?: string;
  particleCount?: number;
  color?: string;
  speed?: number;
  size?: number;
  opacity?: number;
  interactive?: boolean;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  className,
  particleCount = 50,
  color = "hsl(var(--primary))",
  speed = 1,
  size = 2,
  opacity = 0.6,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          id: i,
          x: (Math.random() * canvas.width) / window.devicePixelRatio,
          y: (Math.random() * canvas.height) / window.devicePixelRatio,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * size + 1,
          opacity: Math.random() * opacity + 0.2,
          life: Math.random() * 100,
          maxLife: 100,
        });
      }
    };

    initParticles();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(
        0,
        0,
        canvas.width / window.devicePixelRatio,
        canvas.height / window.devicePixelRatio,
      );

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (
          particle.x <= 0 ||
          particle.x >= canvas.width / window.devicePixelRatio
        ) {
          particle.vx *= -1;
        }
        if (
          particle.y <= 0 ||
          particle.y >= canvas.height / window.devicePixelRatio
        ) {
          particle.vy *= -1;
        }

        // Keep particles in bounds
        particle.x = Math.max(
          0,
          Math.min(canvas.width / window.devicePixelRatio, particle.x),
        );
        particle.y = Math.max(
          0,
          Math.min(canvas.height / window.devicePixelRatio, particle.y),
        );

        // Mouse interaction
        if (interactive) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.vx += (dx / distance) * force * 0.1;
            particle.vy += (dy / distance) * force * 0.1;
          }
        }

        // Limit velocity
        const maxVelocity = 2;
        const velocity = Math.sqrt(
          particle.vx * particle.vx + particle.vy * particle.vy,
        );
        if (velocity > maxVelocity) {
          particle.vx = (particle.vx / velocity) * maxVelocity;
          particle.vy = (particle.vy / velocity) * maxVelocity;
        }

        // Update life
        particle.life -= 0.5;
        if (particle.life <= 0) {
          particle.life = particle.maxLife;
          particle.x = (Math.random() * canvas.width) / window.devicePixelRatio;
          particle.y =
            (Math.random() * canvas.height) / window.devicePixelRatio;
        }

        // Draw particle
        const alpha = (particle.life / particle.maxLife) * particle.opacity;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw connections between nearby particles
      if (interactive) {
        particlesRef.current.forEach((particle, i) => {
          particlesRef.current.slice(i + 1).forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
              const alpha = ((80 - distance) / 80) * 0.2;
              ctx.save();
              ctx.globalAlpha = alpha;
              ctx.strokeStyle = color;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
              ctx.restore();
            }
          });
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Intersection Observer for performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          cancelAnimationFrame(animationRef.current!);
        } else {
          animate();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationRef.current!);
      window.removeEventListener("resize", resizeCanvas);
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
      observer.disconnect();
    };
  }, [particleCount, color, speed, size, opacity, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

// Floating elements component
export const FloatingElements: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden",
        className,
      )}
    >
      {/* Floating geometric shapes */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 border border-primary/20 rounded rotate-45 animate-float" />
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary/10 rounded-full animate-float-slow" />
      <div className="absolute bottom-1/4 left-1/3 w-5 h-5 border border-primary/15 rounded animate-float-reverse" />
      <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-primary/20 rounded animate-float" />
      <div className="absolute bottom-1/3 right-1/3 w-3 h-3 border border-primary/25 rounded-full animate-float-slow" />

      {/* Floating code symbols */}
      <div className="absolute top-1/5 left-1/5 text-primary/20 font-mono text-sm animate-float">
        {"</>"}
      </div>
      <div className="absolute bottom-1/5 right-1/5 text-primary/15 font-mono text-xs animate-float-reverse">
        {"{}"}
      </div>
      <div className="absolute top-1/2 left-1/6 text-primary/25 font-mono text-xs animate-float-slow">
        {"[]"}
      </div>
      <div className="absolute bottom-1/4 left-1/2 text-primary/20 font-mono text-sm animate-float">
        {"()"}
      </div>
    </div>
  );
};

// Gradient background component
export const GradientBackground: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background/50 to-transparent" />
    </div>
  );
};
