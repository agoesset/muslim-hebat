import React from "react";
import { api } from "../api.js";

export function usePublicData(endpoint, fallback = null) {
  const [data, setData] = React.useState(fallback);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api(endpoint)
      .then((res) => {
        if (cancelled) return;
        setData(Array.isArray(res) ? res : res);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("usePublicData error", endpoint, err);
        setError(err.message);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [endpoint]);

  return { data, loading, error, setData };
}
