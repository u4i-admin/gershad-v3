import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import List from "@mui/material/List";
import { memo } from "react";

import UserReportGroupMinimalListItem from "src/components/ReportsPage/UserReportGroupMinimalListItem";
import { GqlReport } from "src/generated/graphQl";
import colors from "src/values/colors";

const item = css({
  ":not(:last-of-type)": {
    borderBottom: `1px solid ${colors.grey}`,
  },
});

const UserReportGroupMinimalList: StylableFC<{
  reports: Array<GqlReport>;
}> = memo(({ reports, ...remainingProps }) => (
  <List disablePadding {...remainingProps}>
    {reports.map((report) => (
      <UserReportGroupMinimalListItem
        report={report}
        css={item}
        key={report.pk}
      />
    ))}
  </List>
));

UserReportGroupMinimalList.displayName = "UserReportGroupMinimalList";

export default UserReportGroupMinimalList;
