import React from "react";
import { Skeleton } from "./Skeleton.jsx";

export function LazyImage({
  src,
  alt,
  width,
  height,
  style = {},
  containerStyle = {},
  placeholderColor = "var(--bg-soft)",
  aspectRatio,
  className = "",
}) {
  const [loaded, setLoaded] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const containerAspect = aspectRatio || (width && height ? `${width}/${height}` : "16/10");

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        width: width || "100%",
        height: height || (aspectRatio ? undefined : "100%"),
        aspectRatio: containerAspect,
        background: placeholderColor,
        borderRadius: "var(--radius-sm)",
        overflow: "hidden",
        ...containerStyle,
      }}
    >
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Skeleton height="100%" style={{ position: "absolute", inset: 0, borderRadius: 0 }} />
        </div>
      )}
      {inView && src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease",
            ...style,
          }}
        />
      )}
    </div>
  );
}
