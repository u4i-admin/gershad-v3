import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { ComponentProps, Dispatch, memo, SetStateAction, useMemo } from "react";

import ReportTypeSelectionButton from "src/components/HomePage/ReportOverlay/ReportTypeSelection/ReportTypeSelectionButton";
import PoliceSvg from "src/components/icons/PoliceSvg";
import RepForceSvg from "src/components/icons/RepForceSvg";
import StopCheckSvg from "src/components/icons/StopCheckSvg";
import VanSvg from "src/components/icons/VanSvg";
import { useAppStrings } from "src/stores/appStore";
import { ReportOverlayState } from "src/types/reportTypes";

export type ReportTypeSelectionStrings = {
  /**
   * Text for Report Type Selection header
   */
  header: string;
};

const reportSelectionContainer = css({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});
const reportDetail = css({
  alignItems: "center",
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  width: "100vw",
});
const title = css({
  textAlign: "center",
});

const ReportTypeSelection: StylableFC<{
  reportState: ReportOverlayState;
  setReportState: Dispatch<SetStateAction<ReportOverlayState | undefined>>;
}> = memo(({ className, reportState, setReportState }) => {
  const { ReportTypeSelection: strings, shared: sharedStrings } =
    useAppStrings();

  const reportTypeSelectionButtonProps = useMemo(
    () =>
      [
        {
          displayName: sharedStrings.reportTypes.police,
          IconComponent: PoliceSvg,
          reportType: "GASHT",
        },
        {
          displayName: sharedStrings.reportTypes.stopCheck,
          IconComponent: StopCheckSvg,
          reportType: "STOP",
        },
        {
          displayName: sharedStrings.reportTypes.van,
          IconComponent: VanSvg,
          reportType: "VAN",
        },
        {
          displayName: sharedStrings.reportTypes.repForce,
          IconComponent: RepForceSvg,
          reportType: "REPFORCE",
        },
      ] satisfies Array<
        Partial<ComponentProps<typeof ReportTypeSelectionButton>>
      >,
    [sharedStrings],
  );

  return (
    <div css={reportSelectionContainer} className={className}>
      <h3 css={title}>{strings.header}</h3>

      <div css={reportDetail}>
        {reportTypeSelectionButtonProps.map((props) => (
          <ReportTypeSelectionButton
            key={props.reportType}
            setReportState={setReportState}
            reportState={reportState}
            {...props}
          />
        ))}
      </div>
    </div>
  );
});

ReportTypeSelection.displayName = "ReportTypeSelection";

export default ReportTypeSelection;
