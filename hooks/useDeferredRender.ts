import { useEffect, useRef, useState } from "react";

type UseDeferredRenderOptions = {
  rootMargin?: string;
};

export const useDeferredRender = (
  options: UseDeferredRenderOptions = {},
) => {
  const { rootMargin = "280px" } = options;
  const [shouldRender, setShouldRender] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldRender) {
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, shouldRender]);

  return { ref, shouldRender };
};
