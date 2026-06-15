import React from "react";
import { useLocation } from "react-router-dom";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function Analytics() {
  const location = useLocation();

  React.useEffect(() => {
    if (!GA_ID || !GA_ID.startsWith("G-")) return;
    if (window.__mhGaLoaded) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(){ window.dataLayer.push(arguments); };
    window.gtag("js", new Date());

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(script);
    window.__mhGaLoaded = true;
  }, []);

  React.useEffect(() => {
    if (!GA_ID || !GA_ID.startsWith("G-") || !window.gtag) return;
    window.gtag("config", GA_ID, {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  return null;
}
