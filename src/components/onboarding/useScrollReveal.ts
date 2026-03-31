"use client";

import { useState, useEffect, useRef } from "react";

/**
 * IntersectionObserver hook — rivela un elemento quando entra nel viewport.
 * Disconnette automaticamente dopo il primo trigger.
 */
export function useScrollReveal(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}
