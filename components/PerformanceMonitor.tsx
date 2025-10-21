import { useEffect } from "react";

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production and browser environment
    if (
      process.env.NODE_ENV !== "production" ||
      typeof window === "undefined"
    ) {
      return;
    }

    // Import web-vitals dynamically
    import("web-vitals")
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        const metrics: PerformanceMetrics = {};

        // Core Web Vitals
        getCLS((metric) => {
          metrics.cls = metric.value;
          console.log("CLS:", metric.value);
          // Send to analytics if available
          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "web_vitals", {
              event_category: "Performance",
              event_label: "CLS",
              value: Math.round(metric.value * 1000),
            });
          }
        });

        getFID((metric) => {
          metrics.fid = metric.value;
          console.log("FID:", metric.value);
          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "web_vitals", {
              event_category: "Performance",
              event_label: "FID",
              value: Math.round(metric.value),
            });
          }
        });

        getLCP((metric) => {
          metrics.lcp = metric.value;
          console.log("LCP:", metric.value);
          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "web_vitals", {
              event_category: "Performance",
              event_label: "LCP",
              value: Math.round(metric.value),
            });
          }
        });

        // Additional metrics
        getFCP((metric) => {
          metrics.fcp = metric.value;
          console.log("FCP:", metric.value);
        });

        getTTFB((metric) => {
          metrics.ttfb = metric.value;
          console.log("TTFB:", metric.value);
        });

        // Store metrics for debugging
        (window as any).__PERFORMANCE_METRICS__ = metrics;
      })
      .catch((error) => {
        console.warn("Failed to load web-vitals:", error);
      });

    // Monitor resource loading performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "resource") {
          const resourceEntry = entry as PerformanceResourceTiming;

          // Log slow resources (> 1s)
          if (resourceEntry.duration > 1000) {
            console.warn("Slow resource:", {
              name: resourceEntry.name,
              duration: resourceEntry.duration,
              size: resourceEntry.transferSize,
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ["resource"] });

    // Monitor navigation timing
    const navigationObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "navigation") {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log("Navigation timing:", {
            domContentLoaded:
              navEntry.domContentLoadedEventEnd -
              navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            totalTime: navEntry.loadEventEnd - navEntry.fetchStart,
          });
        }
      }
    });

    navigationObserver.observe({ entryTypes: ["navigation"] });

    return () => {
      observer.disconnect();
      navigationObserver.disconnect();
    };
  }, []);

  return null;
};

// Hook for monitoring component render performance
export const useRenderPerformance = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (renderTime > 16) {
        // More than one frame (60fps)
        console.warn(
          `${componentName} took ${renderTime.toFixed(2)}ms to render`,
        );
      }
    };
  });
};

// Hook for monitoring memory usage
export const useMemoryMonitor = () => {
  useEffect(() => {
    if (typeof window === "undefined" || !("memory" in performance)) {
      return;
    }

    const checkMemory = () => {
      const memory = (performance as any).memory;
      if (memory) {
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const totalMB = memory.totalJSHeapSize / 1024 / 1024;

        if (usedMB > 50) {
          // More than 50MB
          console.warn("High memory usage:", {
            used: `${usedMB.toFixed(2)}MB`,
            total: `${totalMB.toFixed(2)}MB`,
            limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
          });
        }
      }
    };

    const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);
};
