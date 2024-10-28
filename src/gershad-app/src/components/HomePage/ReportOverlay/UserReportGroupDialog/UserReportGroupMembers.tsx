import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import { memo } from "react";

import UserReportGroupMember from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/UserReportGroupMember";
import { GqlReportGroup } from "src/generated/graphQl";
import { useAppStrings } from "src/stores/appStore";

export type UserReportGroupMembersStrings = {
  /**
   * Text for userReportGroupMembers Overlay details description header
   */
  description: string;
  /**
   * Text for userReportGroupMembers overlay header
   */
  heading: string;
};

const detailsContainer = css({});

const reportDetails = css({
  padding: "1rem",
});

const UserReportGroupMembers: StylableFC<{
  userReportGroup: GqlReportGroup;
}> = memo(({ className, userReportGroup }) => {
  const { UserReportGroupMembers: strings } = useAppStrings();

  return (
    <Box css={reportDetails} className={className}>
      <Typography variant="headingH3" component="h3">
        {strings.heading}
      </Typography>
      <List css={detailsContainer}>
        {userReportGroup?.reports?.map((item, index) => (
          <UserReportGroupMember userReport={item} key={index} />
        ))}
      </List>
    </Box>
  );
});

UserReportGroupMembers.displayName = "Header";

export default UserReportGroupMembers;
