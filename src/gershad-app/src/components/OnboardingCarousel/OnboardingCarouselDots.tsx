import { StylableFC } from "@asl-19/react-dom-utils";
import { css, SerializedStyles } from "@emotion/react";
import { KeenSliderInstance } from "keen-slider/react";
import { memo, useMemo } from "react";

import OnboardingCarouselDot from "src/components/OnboardingCarousel/OnboardingCarouselDot";

const container = css({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  pointerEvents: "none",
  width: "100%",
});

const innerContainer = css({
  display: "flex",
  flexFlow: "row wrap",
  gap: "1rem",
  justifyContent: "center",
});

const dot = css({
  pointerEvents: "initial",
});

const OnboardingCarouselDots: StylableFC<{
  currentPageIndex: number;
  innerCss?: SerializedStyles;
  keenSliderInstance: KeenSliderInstance;
}> = memo(
  ({ currentPageIndex, innerCss, keenSliderInstance, ...remainingProps }) => {
    const innerContainerCss = useMemo(
      () => [innerContainer, innerCss],
      [innerCss],
    );

    return (
      <div css={container} {...remainingProps}>
        <div aria-hidden css={innerContainerCss}>
          {keenSliderInstance.slides.map((slideElement, index) => (
            <OnboardingCarouselDot
              css={dot}
              currentPageIndex={currentPageIndex}
              key={index}
              pageIndex={index}
              keenSliderInstance={keenSliderInstance}
            />
          ))}
        </div>
      </div>
    );
  },
);

OnboardingCarouselDots.displayName = "OnboardingCarouselDots";

export default OnboardingCarouselDots;
