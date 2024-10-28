import { supportsPassiveEvents } from "detect-passive-events";
import { useEffect, useRef } from "react";

/**
 * Call provided onViewportChange on scroll or resize.
 *
 * Updates every 125ms by default (override with `updateFrequency` argument.)
 */
const useOnViewportChange = ({
  onViewportChange,
  updateFrequency = 125,
}: {
  /**
   * Called when viewport is scrolled or resized.
   */
  onViewportChange: () => void;
  /**
   * How often onViewportChange should be run (debounced).
   *
   * If set to 0 debouncing is disabled and onViewportChange is used directly as
   * handler for (passive) resize and scroll event listeners.
   */
  updateFrequency?: number;
}) => {
  const updateScrollStateTimeoutIdRef = useRef<number>(0);
  const lastScrollPositionUpdateUnixTimeRef = useRef<number>(0);

  useEffect(() => {
    const debouncedOnViewportChange = () => {
      window.clearTimeout(updateScrollStateTimeoutIdRef.current);

      const currentUnixTime = Date.now();

      if (
        updateFrequency >
        currentUnixTime - lastScrollPositionUpdateUnixTimeRef.current
      ) {
        updateScrollStateTimeoutIdRef.current = window.setTimeout(
          onViewportChange,
          updateFrequency,
        );

        return;
      }

      onViewportChange();

      lastScrollPositionUpdateUnixTimeRef.current = currentUnixTime;
    };

    onViewportChange();

    const eventListener =
      updateFrequency > 0 ? debouncedOnViewportChange : onViewportChange;

    const eventListenerOptions = supportsPassiveEvents
      ? { passive: true }
      : false;

    window.addEventListener("resize", eventListener, eventListenerOptions);

    window.addEventListener("scroll", eventListener, eventListenerOptions);

    return () => {
      window.removeEventListener("resize", eventListener, false);
      window.removeEventListener("scroll", eventListener, false);
    };
  }, [onViewportChange, updateFrequency]);
};

export default useOnViewportChange;
