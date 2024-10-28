import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { memo } from "react";

import LoadingIndicatorSvg from "src/components/icons/animation/LoadingIndicatorSvg";

const loadingIndicator = css({
  alignSelf: "center",
  flex: "1 1 auto",
  width: "8rem",
});

const PageContentLoadingIndicator: StylableFC = memo(() => (
  <LoadingIndicatorSvg css={loadingIndicator} />
));

PageContentLoadingIndicator.displayName = "PageContentLoadingIndicator";

export default PageContentLoadingIndicator;
