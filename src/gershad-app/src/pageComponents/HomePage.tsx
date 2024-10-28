import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { useMemo, useRef } from "react";

import GoogleMap from "src/components/HomePage/GoogleMap/GoogleMap";
import OnboardingCarousel from "src/components/OnboardingCarousel/OnboardingCarousel";
import PageContent from "src/components/Page/PageContent";
import PageMeta from "src/components/PageMeta";
import routeUrls from "src/routeUrls";
import {
  useAppPreferencesOnboardingCompleted,
  useAppStrings,
} from "src/stores/appStore";
import { MapProvider, MapState } from "src/stores/mapStore";
import { invisible } from "src/styles/generalStyles";
import { PageComponent } from "src/utils/createLocalePageComponent";

// =============
// === Types ===
// =============

export type HomePageProps = {
  enableBookmarking: boolean;
  position: string | null;
};

// ==============
// === Styles ===
// ==============

const map = css({
  height: "100lvh",
  minHeight: "100lvh",
  width: "100vw",
});

const onboardingCarousel = css({
  left: 0,
  position: "absolute",
  top: 0,
});

// ==============================
// === Next.js page component ===
// ==============================

const HomePage: PageComponent = () => {
  const router = useRouter();

  const strings = useAppStrings();

  const googleMapRef = useRef<google.maps.Map>(null);

  const onboardingCompleted = useAppPreferencesOnboardingCompleted();

  const initialMapState: MapState = useMemo(
    () => ({
      boundsHaveChangedFromInitial: false,
      googleMapRef,
      googleMapsApiState: "loading",
      isInitializing: true,
      mapLatLngIsInsideDeviceRangeCircle: false,
    }),
    [],
  );
  return (
    <PageContent>
      <PageMeta canonicalPath={routeUrls.home()} title={null} />

      <h1 css={invisible} id="main-heading">
        {strings.shared.siteTitle}
      </h1>

      {!onboardingCompleted && <OnboardingCarousel css={onboardingCarousel} />}

      <MapProvider initialState={initialMapState}>
        <GoogleMap
          css={map}
          enableBookmarking={router.query.bookmark === "true"}
        />
      </MapProvider>
    </PageContent>
  );
};

export default HomePage;
