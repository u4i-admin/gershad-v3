import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

import UserReportGroupMinimal from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/UserReportGroupMinimal";
import { GqlReport } from "src/generated/graphQl";
import routeUrls from "src/routeUrls";

const UserReportGroupMinimalListItem: StylableFC<{
  report: GqlReport;
}> = memo(({ report, ...remainingProps }) => (
  <li {...remainingProps}>
    <UserReportGroupMinimal
      report={report}
      href={routeUrls.home({
        initialPosition: `${report.location.y},${report.location.x}`,
      })}
    />
  </li>
));

UserReportGroupMinimalListItem.displayName = "UserReportGroupMinimalListItem";

export default UserReportGroupMinimalListItem;
