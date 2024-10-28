import { css, Global } from "@emotion/react";
import Head from "next/head";
import { FC, memo, ReactNode } from "react";

import MenuDrawer from "src/components/MenuDrawer/MenuDrawer";
import Snackbar from "src/components/Snackbar";
import faviconIco from "src/static/favicons/favicon.ico";
import favicon1616Png from "src/static/favicons/favicon-16x16.png";
import favicon3232Png from "src/static/favicons/favicon-32x32.png";
import { useAppStrings } from "src/stores/appStore";
import globalStyles from "src/styles/globalStyles";

const wrapper = css({
  display: "flex",
  flexDirection: "column",
  height: "100dvh",
  overflow: "hidden",
  position: "relative",
  width: "100vw",
});

const Layout: FC<{ children: ReactNode }> = memo(({ children }) => {
  const { shared: sharedStrings } = useAppStrings();

  return (
    <div css={wrapper}>
      <Global styles={globalStyles} />

      <Head>
        {/* Favicon and title not visible in app (here purely for development) */}
        <link rel="shortcut icon" href={faviconIco.src} />

        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={favicon1616Png.src}
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={favicon3232Png.src}
        />

        <title>{sharedStrings.siteTitle}</title>

        {/* ----------------
        --- Prevent zoom ---
        --------------------

        This is considered a bad practice for web sites, but it would be very unusual for an app to allow pinch zooming (the user can still adjust font size). */}

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover"
        />
      </Head>

      <MenuDrawer />

      {children}

      <Snackbar />
    </div>
  );
});

Layout.displayName = "Layout";

export default Layout;
