import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { Dispatch, memo, SetStateAction, useCallback } from "react";

import useCreateReport from "src/hooks/useCreateReport";
import { ReportOverlayState, ReportType } from "src/types/reportTypes";

const reportImage = css({
  height: "5rem",
  minHeight: "5rem",
  minWidth: "5rem",
  width: "5rem",
});

const button = css({
  alignItems: "center",
  border: "none",
  color: "inherit",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  height: "100%",
  textAlign: "center",
});

const ReportTypeSelectionButton: StylableFC<{
  IconComponent: StylableFC;
  displayName: string;
  reportState: ReportOverlayState;
  reportType: ReportType;
  setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
}> = memo(
  ({
    IconComponent,
    displayName,
    reportState,
    reportType,
    setReportState,
    ...remainingProps
  }) => {
    const createReport = useCreateReport();

    const onClick = useCallback(async () => {
      const latLng =
        reportState.type === "isSelectingType" ? reportState.position : null;

      if (!latLng) {
        setReportState({
          errorType: "unexpected",
          type: "hasErrorMessages",
        });
        return;
      }

      createReport({ latLng, reportType, setReportState });
    }, [createReport, reportState, reportType, setReportState]);

    return (
      <button onClick={onClick} css={button} {...remainingProps}>
        <IconComponent css={reportImage} />
        <span>{displayName}</span>
      </button>
    );
  },
);

ReportTypeSelectionButton.displayName = "ReportTypeSelectionButton";

export default ReportTypeSelectionButton;
