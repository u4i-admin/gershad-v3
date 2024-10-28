import { useRouter } from "next/router";
import { useEffect } from "react";

import { RouterEventHandler } from "src/types/nextTypes";
import { logTrackScreenView } from "src/utils/firebaseAnalytics";
import focusElement from "src/utils/focus/focusElement";

/**
 * Focus h1#main-heading on Next.js routeChangeComplete event.
 */
const useFocusMainHeadingOnRouteChange = () => {
  const router = useRouter();

  useEffect(() => {
    const onRouteChangeComplete: RouterEventHandler = (url, { shallow }) => {
      if (!shallow) {
        const mainHeadingElement = document.querySelector("h1#main-heading");

        if (mainHeadingElement) {
          focusElement(document.querySelector("h1#main-heading"), {
            preventScroll: true,
          });

          logTrackScreenView(url);
        } else {
          console.info(
            "h1#main-heading not found so skipping auto-focus on route change (this is okay if page has its own focus logic)",
          );
        }
      }
    };

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, [router]);
};

export default useFocusMainHeadingOnRouteChange;
