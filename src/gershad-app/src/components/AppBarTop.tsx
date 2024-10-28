import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import { Theme, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import { memo, MouseEventHandler } from "react";
import { match, P } from "ts-pattern";

import ChevronSvg from "src/components/icons/ChevronSvg";
import colors from "src/values/colors";

const chevronSvg = css(
  {
    height: "1.5rem",
    width: "1.5rem",
  },
  {
    "html.ltr &": {
      transform: "rotate(180deg)",
    },
  },
);

const heading = css({
  color: colors.black,
  fontSize: "1.375rem",
  height: "2rem",
  lineHeight: "2rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const appBar = ({ theme }: { theme: Theme }) =>
  css({
    backgroundColor: colors.yellow,
    // Account for e.g. iOS notch in Capacitor
    paddingTop: "env(safe-area-inset-top)",
    zIndex: theme.zIndex.appBarTop_appbar,
  });

const toolbar = css({
  columnGap: "1rem",
});

const AppBarTop: StylableFC<
  {
    headingText: string;
  } & (
    | {
        onClick: MouseEventHandler<HTMLButtonElement>;
        url?: never;
      }
    | {
        onClick?: never;
        url: string;
      }
  )
> = memo(({ headingText, onClick, url, ...remainingProps }) => {
  const theme = useTheme();
  return (
    <AppBar
      css={appBar({ theme })}
      elevation={4}
      position="static"
      {...remainingProps}
    >
      <Toolbar css={toolbar}>
        {match({ onClick, url })
          .with({ onClick: P.not(undefined) }, ({ onClick }) => (
            <IconButton onClick={onClick}>
              <ChevronSvg css={chevronSvg} direction="start" />
            </IconButton>
          ))
          .with({ url: P.string }, ({ url }) => (
            <IconButton LinkComponent={Link} href={url}>
              <ChevronSvg css={chevronSvg} direction="start" />
            </IconButton>
          ))
          // This should never be reached since either onClick or url must be
          // set, but TS doesn’t know this
          .otherwise(() => null)}
        <h1 css={heading} id="main-heading">
          {headingText}
        </h1>
      </Toolbar>
    </AppBar>
  );
});

AppBarTop.displayName = "AppBarTop";

export default AppBarTop;
