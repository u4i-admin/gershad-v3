import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { memo } from "react";

import ChevronSvg from "src/components/icons/ChevronSvg";
import routeUrls from "src/routeUrls";
import { useAppStrings } from "src/stores/appStore";

// Extend width to line up with other page elements with ListItemButton padding
// intact
const listItemButton = css({
  alignItems: "center",
  display: "flex",
  // Match the height of the SwitchInput FormGroups
  height: "2.5rem",
  justifyContent: "space-between",
  marginInlineStart: "-1rem",
  width: "calc(100% + 2rem)",
});

const icon = css(
  {
    height: "1rem",
  },
  {
    "html.rtl &": {
      transform: "rotate(180deg)",
    },
  },
);

const NotificationsSettingsLink: StylableFC<{}> = memo(() => {
  const strings = useAppStrings();

  return (
    <ListItemButton
      css={listItemButton}
      LinkComponent={Link}
      href={routeUrls.settingsNotifications()}
    >
      <Typography variant="paraMedium" component="p">
        {
          strings.NotificationsPermissionSettingsList.notificationsSection
            .heading
        }
      </Typography>
      <ChevronSvg direction="end" css={icon} />
    </ListItemButton>
  );
});

NotificationsSettingsLink.displayName = "NotificationsSettingsLink";

export default NotificationsSettingsLink;
