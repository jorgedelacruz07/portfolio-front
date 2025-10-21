import { useEffect, useCallback } from "react";

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

export const usePerformance = () => {
  const measurePerformance = useCallback(() => {
    if (typeof window === "undefined" || !window.performance) {
      return null;
    }

    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType("paint");

    const metrics: PerformanceMetrics = {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      firstContentfulPaint:
        paintEntries.find((entry) => entry.name === "first-contentful-paint")
          ?.startTime || 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
    };

    // Measure LCP
    if ("PerformanceObserver" in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.largestContentfulPaint = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // Measure FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metrics.firstInputDelay = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ["first-input"] });

      // Measure CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metrics.cumulativeLayoutShift = clsValue;
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    }

    return metrics;
  }, []);

  const logPerformance = useCallback((metrics: PerformanceMetrics) => {
    console.log("[Performance Metrics]", metrics);

    // Log to analytics if available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "performance", {
        event_category: "Performance",
        event_label: "Page Load",
        value: Math.round(metrics.loadTime),
        custom_map: {
          fcp: Math.round(metrics.firstContentfulPaint).toString(),
          lcp: Math.round(metrics.largestContentfulPaint).toString(),
          fid: Math.round(metrics.firstInputDelay).toString(),
          cls: (
            Math.round(metrics.cumulativeLayoutShift * 1000) / 1000
          ).toString(),
        },
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const metrics = measurePerformance();
      if (metrics) {
        logPerformance(metrics);
      }
    }, 2000); // Wait 2 seconds for all metrics to be available

    return () => clearTimeout(timer);
  }, [measurePerformance, logPerformance]);

  return {
    measurePerformance,
    logPerformance,
  };
};
