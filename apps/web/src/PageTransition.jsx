import React from "react";
import { useLocation } from "react-router-dom";

export function PageTransition({ children }) {
  const location = useLocation();
  const key = location.pathname + location.search;

  return (
    <div key={key} className="page-enter">
      {children}
    </div>
  );
}
