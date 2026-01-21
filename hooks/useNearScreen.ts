import { useState, useEffect, useRef } from 'react';

export function useNearScreen(distance: string = '200px') {
  const [isNearScreen, setIsNearScreen] = useState(false);
  const fromRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;

    const element = fromRef.current;

    const onChange = (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
      const el = entries[0];
      if (el.isIntersecting) {
        setIsNearScreen(true);
        obs.disconnect();
      }
    };

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(onChange, { rootMargin: distance });
      if (element) {
        observer.observe(element);
      }
    } else {
      // Fallback for SSR or no support: load immediately
      setIsNearScreen(true);
    }

    return () => observer && observer.disconnect();
  }, [distance]);

  return { isNearScreen, fromRef };
}
