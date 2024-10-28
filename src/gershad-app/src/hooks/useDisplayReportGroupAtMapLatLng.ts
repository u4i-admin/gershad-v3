import { Dispatch, SetStateAction, useEffect } from "react";

import {
  useAppDispatch,
  useAppMapLatLngAndZoom,
  useAppReportGroupHasBeenDisplayedAtCurrentMapLatLng,
  useAppReportGroups,
} from "src/stores/appStore";
import { ReportOverlayState } from "src/types/reportTypes";

/**
 * Small threshold to account for rounding errors.
 *
 * @remarks This probably isn’t necessary and could even cause the incorrect
 * report to be opened if reports are very close together, but it wouldn’t be
 * surprising if a rounding error caused an exact numerical check to fail.
 */
const sameLocationLatLngThreshold = 0.00001;

const useDisplayReportGroupAtMapLatLng = ({
  setReportState,
}: {
  setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
}) => {
  const appDispatch = useAppDispatch();
  const appMapLatLngAndZoom = useAppMapLatLngAndZoom();
  const appReportGroups = useAppReportGroups();
  const appReportGroupHasBeenDisplayedAtCurrentMapLatLng =
    useAppReportGroupHasBeenDisplayedAtCurrentMapLatLng();

  useEffect(() => {
    if (
      !appMapLatLngAndZoom ||
      appReportGroupHasBeenDisplayedAtCurrentMapLatLng
    ) {
      return;
    }

    const reportGroupAtDeviceLatLng = appReportGroups.find((reportGroup) => {
      return reportGroup.reports?.some((report) => {
        const latDelta = Math.abs(report.location.x - appMapLatLngAndZoom.lng);
        const lngDelta = Math.abs(report.location.y - appMapLatLngAndZoom.lat);

        const reportIsWithinSameLocationLatLngThreshold =
          latDelta <= sameLocationLatLngThreshold &&
          lngDelta <= sameLocationLatLngThreshold;

        // console.info(
        //   `[useOpenReportGroupAtMapLatLng] Checking report ${report.pk} of group ${reportGroup.highestPk}:`,
        //   { latDelta, lngDelta, reportIsWithinSameLocationLatLngThreshold },
        // );

        return reportIsWithinSameLocationLatLngThreshold;
      });
    });

    if (reportGroupAtDeviceLatLng) {
      setReportState({
        reportGroup: reportGroupAtDeviceLatLng,
        type: "isDisplayingReport",
      });

      appDispatch({ type: "reportGroupDisplayedAtCurrentMapLatLng" });
    }
  }, [
    appDispatch,
    appMapLatLngAndZoom,
    appReportGroupHasBeenDisplayedAtCurrentMapLatLng,
    appReportGroups,
    setReportState,
  ]);
};

export default useDisplayReportGroupAtMapLatLng;
