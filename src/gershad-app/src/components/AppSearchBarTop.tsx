import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import { Theme, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import { Dispatch, memo, SetStateAction } from "react";

import ChevronSvg from "src/components/icons/ChevronSvg";
import SearchBox from "src/components/KnowYourRightsPage/SearchBox";
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

const searchBar = css({
  flexGrow: 1,
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
  display: "flex",
});

const AppSearchBarTop: StylableFC<
  | {
      focused?: boolean;
      previousPageUrl: string;
      searchQuery: string;
      searchUrl?: never;
      setSearchQuery: Dispatch<SetStateAction<string>>;
    }
  | {
      focused?: never;
      previousPageUrl: string;
      searchQuery?: string;
      searchUrl?: string;
      setSearchQuery?: never;
    }
> = memo(
  ({
    previousPageUrl,
    searchQuery,
    searchUrl,
    setSearchQuery,
    ...remainingProps
  }) => {
    const theme = useTheme();

    return (
      <AppBar
        css={appBar({ theme })}
        elevation={4}
        position="static"
        {...remainingProps}
      >
        <Toolbar css={toolbar}>
          <IconButton LinkComponent={Link} href={previousPageUrl}>
            <ChevronSvg css={chevronSvg} direction="start" />
          </IconButton>

          {searchUrl ? (
            <SearchBox
              url={searchUrl}
              css={searchBar}
              searchQuery={searchQuery}
            />
          ) : (
            setSearchQuery && (
              <SearchBox
                searchQuery={searchQuery ?? ""}
                setSearchQuery={setSearchQuery}
                css={searchBar}
              />
            )
          )}
        </Toolbar>
      </AppBar>
    );
  },
);

AppSearchBarTop.displayName = "AppSearchBarTop";

export default AppSearchBarTop;
