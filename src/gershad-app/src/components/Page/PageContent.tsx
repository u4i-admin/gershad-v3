import { css } from "@emotion/react";
import type { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { ComponentProps, FC, memo, ReactNode, useMemo } from "react";

import { useAppOverlayScrollbarsComponent } from "src/stores/appStore";

const content = css({
  display: "flex",
  flex: "1 0 0px",
  flexFlow: "column",
  overflow: "hidden",
  // Account for e.g. iOS home indicator in Capacitor or installed web app
  paddingBottom: "env(safe-area-inset-bottom)",
  width: "100%",
});

const contentScrollable = css(content, {
  overflow: "hidden auto",
});

const PageContent: FC<{
  children: ReactNode;
  className?: string;
  isScrollable?: boolean;
}> = memo(({ children, className, isScrollable }) => {
  const OverlayScrollbars = useAppOverlayScrollbarsComponent();

  const overlayScrollbarsOptions = useMemo<
    ComponentProps<typeof OverlayScrollbarsComponent>["options"]
  >(
    () => ({
      scrollbars: {
        autoHide: "scroll",
      },
    }),
    [],
  );

  if (OverlayScrollbars) {
    return (
      <OverlayScrollbars
        className={className}
        css={isScrollable ? contentScrollable : content}
        options={overlayScrollbarsOptions}
        defer
      >
        {children}
      </OverlayScrollbars>
    );
  } else {
    return (
      <div css={isScrollable ? contentScrollable : content}>{children}</div>
    );
  }
});

PageContent.displayName = "PageContent";

export default PageContent;
