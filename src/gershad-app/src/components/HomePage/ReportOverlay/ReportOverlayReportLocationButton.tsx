import { StylableFC } from "@asl-19/react-dom-utils";
import Button from "@mui/material/Button";
import { Dispatch, memo, SetStateAction, useCallback } from "react";

import { useAppStrings } from "src/stores/appStore";
import { useMapGoogleMapRef } from "src/stores/mapStore";
import { ReportOverlayState } from "src/types/reportTypes";

export type ReportOverlayReportLocationButtonStrings = {
  /**
   * Text of "Report location" button.
   */
  buttonText: string;
};

const ReportOverlayReportLocationButton: StylableFC<{
  currentLatLngIsInsideRange: boolean;
  setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
}> = memo(
  ({ currentLatLngIsInsideRange, setReportState, ...remainingProps }) => {
    const strings = useAppStrings();

    const mapRef = useMapGoogleMapRef();

    const onOpenReportTypeSelectionClick = useCallback(() => {
      if (!mapRef) return;

      const currentPosition = mapRef.current?.getCenter();

      const currentLatLng: google.maps.LatLngLiteral = {
        lat: currentPosition?.lat() ?? 0,
        lng: currentPosition?.lng() ?? 0,
      };

      setReportState({
        action: "report",
        position: currentLatLng,
        type: "isSelectingType",
      });
    }, [mapRef, setReportState]);

    return (
      <Button
        variant="contained"
        onClick={onOpenReportTypeSelectionClick}
        disabled={!currentLatLngIsInsideRange}
        size="large"
        {...remainingProps}
      >
        {strings.ReportOverlayReportLocationButton.buttonText}
      </Button>
    );
  },
);

ReportOverlayReportLocationButton.displayName =
  "ReportOverlayReportLocationButton";

export default ReportOverlayReportLocationButton;
