import { css } from "@emotion/react";
import { memo, ReactNode } from "react";
import { match } from "ts-pattern";

import ErrorMessageDialog from "src/components/ErrorMessageDialog";
import HomePageSearchNav from "src/components/HomePageSearchNav";
import { useAppGoogleMapsApiState, useAppStrings } from "src/stores/appStore";
import colors from "src/values/colors";

export type GoogleMapsApiLoadingLogicStrings = {
  /**
   * Error message to display when Google Maps fails to load.
   */
  googleMapsApiErrorMessage: string;
};

const blankContainer = css({
  background: colors.grey,
  height: "100%",
  width: "100%",
});

const GoogleMapsApiLoadingLogic = memo(
  ({
    children,
    enableBookmarking,
  }: {
    children?: ReactNode;
    enableBookmarking: boolean;
  }) => {
    const googleMapsApiState = useAppGoogleMapsApiState();
    const strings = useAppStrings();

    const content = match(googleMapsApiState)
      .with("failed", () => (
        <ErrorMessageDialog
          // TODO: Need error messages
          errorMessages={
            strings.GoogleMapsApiLoadingLogic.googleMapsApiErrorMessage
          }
          errorHeading={strings.ErrorMessageDialog.networkErrorHeading}
        />
      ))
      .with("loaded", () => children)
      // TODO: maybe need a loading design ?
      .otherwise(() => <div css={blankContainer} />);

    return (
      <>
        <HomePageSearchNav enableBookmarking={enableBookmarking} />
        {content}
      </>
    );
  },
);

GoogleMapsApiLoadingLogic.displayName = "GoogleMapsApiLoadingLogic";

export default GoogleMapsApiLoadingLogic;
