"use client";

import { useEffect, useRef } from "react";

/**
 * Locks body scrolling (used by the opening veil) without the iOS jump that
 * `position: fixed` causes.
 */
export function useScrollLock(locked: boolean) {
  const previous = useRef<string>("");

  useEffect(() => {
    if (!locked) return;
    previous.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous.current;
    };
  }, [locked]);
}
