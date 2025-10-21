import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

function sendToAnalytics(metric: any) {
  // Send to Google Analytics if available
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value,
      ),
      non_interaction: true,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("Web Vital:", metric);
  }
}

export function reportWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
