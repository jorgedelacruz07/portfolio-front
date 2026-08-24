import { useEffect } from "react";

interface PerformanceMetrics {
  lcp?: number;
  inp?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production and browser environment
    if (!import.meta.env.PROD || typeof window === "undefined") {
      return;
    }

    // Import web-vitals dynamically to avoid blocking critical bundle
    import("web-vitals")
      .then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        const metrics: PerformanceMetrics = {};

        // Cumulative Layout Shift (CLS)
        onCLS((metric) => {
          metrics.cls = metric.value;
          if (window.gtag) {
            window.gtag("event", "web_vitals", {
              event_category: "Performance",
              event_label: "CLS",
              value: Math.round(metric.value * 1000),
            });
          }
        });

        // Interaction to Next Paint (INP) - replaced legacy FID
        onINP((metric) => {
          metrics.inp = metric.value;
          if (window.gtag) {
            window.gtag("event", "web_vitals", {
              event_category: "Performance",
              event_label: "INP",
              value: Math.round(metric.value),
            });
          }
        });

        // Largest Contentful Paint (LCP)
        onLCP((metric) => {
          metrics.lcp = metric.value;
          if (window.gtag) {
            window.gtag("event", "web_vitals", {
              event_category: "Performance",
              event_label: "LCP",
              value: Math.round(metric.value),
            });
          }
        });

        // First Contentful Paint (FCP)
        onFCP((metric) => {
          metrics.fcp = metric.value;
        });

        // Time to First Byte (TTFB)
        onTTFB((metric) => {
          metrics.ttfb = metric.value;
        });

        (
          window as unknown as { __PERFORMANCE_METRICS__?: PerformanceMetrics }
        ).__PERFORMANCE_METRICS__ = metrics;
      })
      .catch((error) => {
        console.warn("Failed to load web-vitals:", error);
      });
  }, []);

  return null;
};
