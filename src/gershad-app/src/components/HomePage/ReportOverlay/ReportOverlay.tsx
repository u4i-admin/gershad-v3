import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { Dispatch, memo, SetStateAction } from "react";
import { match } from "ts-pattern";

import ReportOverlayReportLocationButton from "src/components/HomePage/ReportOverlay/ReportOverlayReportLocationButton";
import ReportErrorMessageDialog from "src/components/HomePage/ReportOverlay/ReportTypeSelection/ReportErrorMessageDialog";
import ReportTypeSelectionDialog from "src/components/HomePage/ReportOverlay/ReportTypeSelection/ReportTypeSelectionDialog";
import UserReportGroupDialog from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/UserReportGroupDialog";
import LoadingOverlay from "src/components/LoadingOverlay";
import { useAppBackgroundGeolocationProviderState } from "src/stores/appStore";
import {
  fixedCenteredContainer,
  textOverflowEllipsis,
} from "src/styles/generalStyles";
import { ReportOverlayState } from "src/types/reportTypes";

const reportOverlayReportLocationButton = css(
  fixedCenteredContainer,
  textOverflowEllipsis,
  {
    bottom: "3rem",
    display: "block",
    maxWidth: "calc(100% - 2rem)",
  },
);

const ReportOverlay: StylableFC<{
  currentLatLngIsInsideRange: boolean;
  reportState: ReportOverlayState;
  setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
}> = memo(({ currentLatLngIsInsideRange, reportState, setReportState }) => {
  const appBackgroundGeolocationProviderState =
    useAppBackgroundGeolocationProviderState();

  return (
    <>
      {match({ appBackgroundGeolocationProviderState, reportState })
        .with(
          {
            appBackgroundGeolocationProviderState: {
              precise: true,
              type: "granted",
            },
            reportState: { type: "isNotReporting" },
          },
          () => (
            <ReportOverlayReportLocationButton
              currentLatLngIsInsideRange={currentLatLngIsInsideRange}
              css={reportOverlayReportLocationButton}
              setReportState={setReportState}
            />
          ),
        )
        .with({ reportState: { type: "isNotReporting" } }, () => null)
        .with(
          {
            reportState: {
              type: "isSelectingType",
            },
          },
          () => (
            <ReportTypeSelectionDialog
              reportState={reportState}
              setReportState={setReportState}
            />
          ),
        )
        .with({ reportState: { type: "isSubmittingReport" } }, () => (
          <LoadingOverlay />
        ))
        .with(
          {
            reportState: {
              type: "isDisplayingReport",
            },
          },
          ({ reportState: { reportGroup: userReportGroup } }) => (
            <UserReportGroupDialog
              reportGroup={userReportGroup}
              key={userReportGroup.lastUpdate}
              openUserReportGroupDialog={!!userReportGroup}
              setReportState={setReportState}
            />
          ),
        )
        .with(
          { reportState: { type: "hasErrorMessages" } },
          ({ reportState: { errorType, message } }) => (
            <ReportErrorMessageDialog
              openErrorMessageDialog={!!errorType}
              setReportState={setReportState}
              errorType={errorType}
              message={message}
            />
          ),
        )
        .exhaustive()}
    </>
  );
});

ReportOverlay.displayName = "ReportOverlay";

export default ReportOverlay;
