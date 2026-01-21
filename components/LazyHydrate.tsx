import React, { useState, useEffect, useRef } from 'react';

interface LazyHydrateProps {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
}

export const LazyHydrate: React.FC<LazyHydrateProps> = ({
  children,
  className,
  rootMargin = '200px'
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If already rendered, no need to observe anymore
    if (shouldRender) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setShouldRender(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [shouldRender, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {shouldRender ? children : null}
    </div>
  );
};
