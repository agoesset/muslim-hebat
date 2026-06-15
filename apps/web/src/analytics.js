const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function hasAnalytics() {
  return Boolean(GA_ID && GA_ID.startsWith("G-") && typeof window !== "undefined" && window.gtag);
}

export function trackEvent(name, params = {}) {
  if (!hasAnalytics()) return;
  window.gtag("event", name, {
    site: "muslim_hebat",
    ...params,
  });
}
