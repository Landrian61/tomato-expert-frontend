import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Call once to initialize
    handleResize();

    // Add event listener with passive option for better performance
    window.addEventListener("resize", handleResize, { passive: true });

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

// Utility function to check if the device is touch-capable
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState<boolean>(
    typeof window !== "undefined"
      ? "ontouchstart" in window || navigator.maxTouchPoints > 0
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}
