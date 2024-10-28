import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { memo } from "react";

import ExclamationSvg from "src/components/icons/ExclamationSvg";
import NoticeBox from "src/components/NoticeBox";
import routeUrls from "src/routeUrls";
import { useAppStrings } from "src/stores/appStore";
import colors from "src/values/colors";

export type BackgroundGeolocationDisabledNoticeStrings = {
  /**
   * Text before "Settings" in warning
   */
  prefix: string;
  /**
   * Text after "Settings" in warning
   */
  suffix: string;
};

const container = css({
  alignItems: "center",
  columnGap: "1rem",
  flexDirection: "row",
});

const icon = css({
  height: "2rem",
  minWidth: "2rem",
});

const settings = css({
  color: colors.red,
});

const BackgroundGeolocationDisabledNotice: StylableFC = memo(() => {
  const strings = useAppStrings();

  return (
    <NoticeBox css={container}>
      <ExclamationSvg
        css={icon}
        backgroundColor={colors.orange}
        foregroundColor={colors.white}
      />

      <Typography variant="paraMedium" component="p">
        {strings.BackgroundGeolocationDisabledNotice.prefix}
        <Link href={routeUrls.settings()} css={settings}>
          &nbsp;{strings.MenuDrawer.secondaryList.settings}&nbsp;
        </Link>
        {strings.BackgroundGeolocationDisabledNotice.suffix}
      </Typography>
    </NoticeBox>
  );
});

BackgroundGeolocationDisabledNotice.displayName =
  "BackgroundGeolocationDisabledNotice";

export default BackgroundGeolocationDisabledNotice;
