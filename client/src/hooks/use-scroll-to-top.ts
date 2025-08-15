import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Custom hook that scrolls to the top of the page whenever the route changes
 */
export function useScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top instantly when location changes
    window.scrollTo(0, 0);
  }, [location]);
}