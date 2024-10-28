import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { memo } from "react";

import ReportTypeCountListItem from "src/components/HomePage/GoogleMap/HotZone/ReportTypeCountListItem";
import { GqlReportsTypeCount } from "src/generated/graphQl";
const container = css({
  display: "flex",
  gap: "0.75rem",
  justifyContent: "space-between",
});
const ReportTypeCountList: StylableFC<{
  reportTypeCounts: Array<GqlReportsTypeCount | null>;
}> = memo(({ reportTypeCounts }) => (
  <div css={container}>
    {reportTypeCounts.map((reportTypeCount) =>
      reportTypeCount ? (
        <ReportTypeCountListItem
          reportTypeCount={reportTypeCount}
          key={reportTypeCount.reportType}
        />
      ) : null,
    )}
  </div>
));

ReportTypeCountList.displayName = "ReportMarker";

export default ReportTypeCountList;
