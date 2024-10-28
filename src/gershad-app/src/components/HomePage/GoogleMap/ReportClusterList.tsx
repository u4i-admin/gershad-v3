import { StylableFC } from "@asl-19/react-dom-utils";
import { Dispatch, memo, SetStateAction, useCallback } from "react";

import ReportClusterListItem from "src/components/HomePage/GoogleMap/ReportClusterListItem";
import { GqlReportGroup } from "src/generated/graphQl";
import { useAppReportGroups } from "src/stores/appStore";
import { ReportOverlayState } from "src/types/reportTypes";

const ReportClusterList: StylableFC<{
  setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
}> = memo(({ setReportState }) => {
  const appReportGroups = useAppReportGroups();

  const onOpenUserReportGroupDialogClick = useCallback(
    ({ userReportGroup }: { userReportGroup: GqlReportGroup }) => {
      setReportState({
        reportGroup: userReportGroup,
        type: "isDisplayingReport",
      });
    },
    [setReportState],
  );

  if (!appReportGroups) return null;

  return (
    <ReportClusterListItem
      userReportGroups={appReportGroups}
      onOpenUserReportGroupDialogClick={onOpenUserReportGroupDialogClick}
    />
  );
});

ReportClusterList.displayName = "ReportClusterList";

export default ReportClusterList;
