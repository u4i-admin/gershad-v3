import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { memo } from "react";

import colors from "src/values/colors";

const container = css({
  background: "white",
  display: "flex",
  justifyContent: "space-between",
  width: "110px",
});

const block = css({
  height: "5px",
  width: "20px",
});

const fullBlock = css(block, {
  backgroundColor: colors.orange,
});

const emptyBlock = css(block, {
  backgroundColor: colors.lightGrey,
});

const HotzoneLevel: StylableFC<{ level: number }> = memo(
  ({ level, ...remainingProps }) => {
    const fullBlocks = Math.floor(level);
    const emptyBlocks = 5 - fullBlocks;

    return (
      <div css={container} {...remainingProps}>
        {Array.from({ length: fullBlocks }, (_, index) => (
          <div css={fullBlock} key={index} />
        ))}
        {Array.from({ length: emptyBlocks }, (_, index) => (
          <div css={emptyBlock} key={index} />
        ))}
      </div>
    );
  },
);

HotzoneLevel.displayName = "ReportMarker";

export default HotzoneLevel;
