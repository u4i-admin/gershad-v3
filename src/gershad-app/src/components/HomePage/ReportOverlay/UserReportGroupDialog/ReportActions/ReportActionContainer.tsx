import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { Dispatch, memo, SetStateAction } from "react";

import ReportActionBookmarkButton from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/ReportActions/ReportActionBookmarkButton";
import ReportActionConfirmButton from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/ReportActions/ReportActionConfirmButton";
import ReportActionDeleteButton from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/ReportActions/ReportActionDeleteButton";
import ReportActionShareButton from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/ReportActions/ReportActionShareButton";
import SegmentContainer from "src/components/SegmentContainer";
import { GqlReport, GqlReportGroup } from "src/generated/graphQl";
import { ReportOverlayState } from "src/types/reportTypes";
import colors from "src/values/colors";

const reportActionContainer = css({
  alignItems: "center",
  backgroundColor: colors.yellow,
  display: "flex",
  flex: "0 0 auto",
  height: "6rem",
  justifyContent: "space-around",
});

const ReportActionContainer: StylableFC<{
  activeUserReport: GqlReport | null;
  setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
  userReportGroup: GqlReportGroup;
}> = memo(
  ({
    activeUserReport,
    setReportState,
    userReportGroup,
    ...remainingProps
  }) => (
    <SegmentContainer
      css={reportActionContainer}
      padding="narrow"
      {...remainingProps}
    >
      <ReportActionBookmarkButton userReportGroup={userReportGroup} />

      <ReportActionShareButton userReportGroup={userReportGroup} />

      {!userReportGroup.permanent &&
        (activeUserReport ? (
          <ReportActionDeleteButton
            activeUserReport={activeUserReport}
            setReportState={setReportState}
          />
        ) : (
          <ReportActionConfirmButton
            setReportState={setReportState}
            reportGroup={userReportGroup}
          />
        ))}
    </SegmentContainer>
  ),
);

ReportActionContainer.displayName = "ReportActionContainer";

export default ReportActionContainer;
