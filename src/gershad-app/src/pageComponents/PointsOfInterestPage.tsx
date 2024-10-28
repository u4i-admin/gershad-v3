import { css } from "@emotion/react";
import { useEffect } from "react";

import AppBarTop from "src/components/AppBarTop";
import BackgroundGeolocationDisabledNotice from "src/components/BackgroundGeolocationDisabledNotice";
import PageContent from "src/components/Page/PageContent";
import PageContainer from "src/components/PageContainer";
import PageMeta from "src/components/PageMeta";
import AddPointOfInterestsFab from "src/components/PointsOfInterestPage/AddPointsOfInterestFab";
import PointOfInterestList from "src/components/PointsOfInterestPage/PointOfInterestList";
import routeUrls from "src/routeUrls";
import {
  useAppBackgroundGeolocationTrackingState,
  useAppDispatch,
  useAppPointOfInterests,
  useAppStrings,
  useAppUserToken,
} from "src/stores/appStore";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";
import { PageComponent } from "src/utils/createLocalePageComponent";

// =============
// === Types ===
// =============

export type PointsOfInterestPageStrings = {
  /**
   * Text appears when there's no bookmarked locations
   */
  noBookmarkedDescription: string;
  /**
   * Page title. Used in header and SEO tags.
   */
  pageTitle: string;
};

const container = css({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  paddingTop: "1rem",
});

const addPointOfInterestsFab = css({
  bottom: "2rem",
  insetInlineEnd: "2rem",
  position: "fixed",
});

// ==============================
// === Next.js page component ===
// ==============================

export const pointOfInterestsName = "pointOfInterests";

export type LocationInfo = {
  id: string;
  position: google.maps.LatLngLiteral;
};

const PointsOfInterestsPage: PageComponent = () => {
  const strings = useAppStrings();

  const dispatch = useAppDispatch();

  const userToken = useAppUserToken();

  const appBackgroundGeolocationTrackingState =
    useAppBackgroundGeolocationTrackingState();

  const pointOfInterests = useAppPointOfInterests();

  useEffect(() => {
    const getPointOfInterests = async () => {
      try {
        const graphQlSdk = await getGraphQlSdk();

        const pointsOfInterestResponse = await graphQlSdk.getPointsOfInterest({
          orderBy: "-created",
          token: userToken,
        });

        const pointsOfInterest = (
          pointsOfInterestResponse?.pointsOfInterest || []
        ).reduce((acc, edge) => (edge ? [...acc, edge] : acc), []);

        if (!pointsOfInterest) {
          dispatch({
            messageStringKey: "shared.toasts.dataLoadFailed",
            messageType: "error",
            type: "snackbarQueued",
          });
        } else {
          dispatch({
            pointsOfInterest,
            type: "updatePointsOfInterest",
          });
        }
      } catch (error) {
        console.error(
          "[PointsOfInterestsPage] Error in getPointOfInterests:",
          error,
        );

        dispatch({
          messageStringKey: "shared.toasts.dataLoadFailed",
          messageType: "error",
          type: "snackbarQueued",
        });
      }
    };

    getPointOfInterests();
  }, [dispatch, strings, userToken]);

  return (
    <>
      <PageMeta
        canonicalPath={routeUrls.pointsOfInterest()}
        title={strings.PointsOfInterestPage.pageTitle}
      />

      <AppBarTop
        headingText={strings.PointsOfInterestPage.pageTitle}
        url={routeUrls.home()}
      />

      <PageContent isScrollable>
        <PageContainer maxWidth="sm" css={container}>
          {appBackgroundGeolocationTrackingState !== "enabled" && (
            <BackgroundGeolocationDisabledNotice />
          )}

          {pointOfInterests && <PointOfInterestList />}

          <AddPointOfInterestsFab css={addPointOfInterestsFab} />
        </PageContainer>
      </PageContent>
    </>
  );
};

export default PointsOfInterestsPage;
