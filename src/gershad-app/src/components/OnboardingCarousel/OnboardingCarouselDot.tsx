import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { KeenSliderInstance } from "keen-slider/react";
import { memo, useCallback } from "react";

import colors from "src/values/colors";

const dot = css({
  borderRadius: "50%",
  height: "0.75rem",
  width: "0.75rem",
});

const dotActive = css(dot, {
  backgroundColor: colors.white,
});

const dotInactive = css(dot, {
  backgroundColor: colors.darkGrey,
});

const OnboardingCarouselDot: StylableFC<{
  currentPageIndex: number;
  keenSliderInstance: KeenSliderInstance;
  pageIndex: number;
}> = memo(
  ({ currentPageIndex, keenSliderInstance, pageIndex, ...remainingProps }) => {
    const onClick = useCallback(() => {
      const length = keenSliderInstance.slides.length;

      const index = pageIndex + 1 > length ? length - 1 : pageIndex;

      keenSliderInstance.moveToIdx(index);
    }, [keenSliderInstance, pageIndex]);

    return (
      <button
        css={pageIndex === currentPageIndex ? dotActive : dotInactive}
        key={pageIndex}
        onClick={onClick}
        {...remainingProps}
      />
    );
  },
);

OnboardingCarouselDot.displayName = "OnboardingCarouselDot";

export default OnboardingCarouselDot;
