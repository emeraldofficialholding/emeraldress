"use client";

import { usePageTracking } from "@/hooks/usePageTracking";

/**
 * Wrapper client per usePageTracking, usato dal layout marketing (RSC).
 * Non renderizza nulla, solo side-effect tracking.
 */
export function PageTracker() {
  usePageTracking();
  return null;
}
