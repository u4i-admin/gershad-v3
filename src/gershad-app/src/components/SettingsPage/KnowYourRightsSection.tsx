import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { memo } from "react";

import ChevronSvg from "src/components/icons/ChevronSvg";
import routeUrls from "src/routeUrls";
import { useAppStrings } from "src/stores/appStore";

const listItemButton = css({
  alignItems: "center",
  display: "flex",
  // Match the height of the SwitchInput FormGroups
  height: "2.5rem",
  justifyContent: "space-between",
  marginInlineStart: "-1rem",
  width: "calc(100% + 2rem)",
});

const icon = css({
  height: "1rem",
});

const KnowYourRightSection: StylableFC<{}> = memo(() => {
  const { KnowYourRightsPage: strings } = useAppStrings();
  return (
    <ListItemButton
      css={listItemButton}
      href={routeUrls.knowYourRights()}
      LinkComponent={Link}
    >
      <Typography variant="paraMedium" component="p">
        {strings.pageTitle}
      </Typography>
      <ChevronSvg direction="end" css={icon} />
    </ListItemButton>
  );
});

KnowYourRightSection.displayName = "KnowYourRightSection";

export default KnowYourRightSection;
