import React from "react";

const siteUrl = import.meta.env.VITE_SITE_URL || "https://muslimhebat.com";

export function Seo({ title, description, jsonLd, noindex = false, image }) {
  React.useEffect(() => {
    document.title = title;
    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", `${siteUrl}${window.location.pathname}`, "property");
    setMeta("og:image", image || `${siteUrl}/og-image.png`, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image || `${siteUrl}/og-image.png`);
    setCanonical(`${siteUrl}${window.location.pathname}`);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");

    const existing = document.querySelector("script[data-json-ld]");
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.jsonLd = "true";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, jsonLd, noindex, image]);

  return null;
}

function setMeta(name, content, attr = "name") {
  if (!content) return;
  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href) {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}
