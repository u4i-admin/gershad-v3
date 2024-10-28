import "keen-slider/keen-slider.min.css";

import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import { KeenSliderInstance, useKeenSlider } from "keen-slider/react";
import { memo, useCallback, useMemo, useState } from "react";
import { match, P } from "ts-pattern";

import OnboardingCarouselButton from "src/components/OnboardingCarousel/OnboardingCarouselButton";
import OnboardingCarouselDots from "src/components/OnboardingCarousel/OnboardingCarouselDots";
import OnboardingCarouselItem, {
  OnboardingCarouselItemInfo,
} from "src/components/OnboardingCarousel/OnboardingCarouselItem";
import onboarding1Png from "src/static/onboarding/onboarding1.png";
import onboarding2Png from "src/static/onboarding/onboarding2.png";
import onboarding3Png from "src/static/onboarding/onboarding3.png";
import {
  useAppDispatch,
  useAppLocaleInfo,
  useAppStrings,
} from "src/stores/appStore";
import { MuiSx } from "src/types/styleTypes";
import colors from "src/values/colors";

type CarouselSlideStrings = {
  description: string;
  title: string;
};

export type OnboardingCarouselStrings = {
  buttons: {
    /**
     * Text for next button
     */
    next: string;
    /**
     * Text for previous button
     */
    prev: string;
    /**
     * Text for start button
     */
    start: string;
  };
  slide1: CarouselSlideStrings;
  slide2: CarouselSlideStrings;
  slide3: CarouselSlideStrings;
};

const container: MuiSx = ({ zIndex }) => ({
  backgroundColor: colors.white,
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  height: "100vh",
  // position: "relative",
  width: "100vw",
  zIndex: zIndex.onBoardingCarousel_container,
});

const slider = css({
  flex: "1 1 auto",
  paddingBottom: "4.0625rem",
});

const carouselDots = {
  flex: "0 1 100%",
  height: "4.0625rem",
};

const carouselButton = css({
  flex: "0 1 100%",
  height: "100%",
  textAlign: "center",
});

const actionsContainer = css({
  backgroundColor: colors.yellow,
  bottom: 0,
  display: "flex",
  height: "4.0625rem",
  insetInlineEnd: 0,
  insetInlineStart: 0,
  position: "absolute",
  width: "100vw",
  zIndex: 3,
});

const OnboardingCarousel: StylableFC<{}> = memo(({ ...remainingProps }) => {
  const appDispatch = useAppDispatch();
  const { direction } = useAppLocaleInfo();
  const strings = useAppStrings();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [keenSliderInstance, setKeenSliderInstance] =
    useState<KeenSliderInstance>();

  const [keenSliderElementRef] = useKeenSlider<HTMLDivElement>({
    created(keenSliderInstance) {
      // Don’t show slider until layout is complete (use setTimeout to wait a
      // "tick" for Keen to finish layout).
      setTimeout(() => {
        setKeenSliderInstance(keenSliderInstance);
      }, 0);
    },
    renderMode: "performance",
    rtl: direction === "rtl",
    slideChanged(slider) {
      setCurrentSlideIndex(slider.track.details.rel);
    },
  });

  const slideElements = useMemo(
    () =>
      (
        [
          {
            description: strings.OnBoardingCarousel.slide1.description,
            staticImageData: onboarding1Png,
            title: strings.OnBoardingCarousel.slide1.title,
          },
          {
            description: strings.OnBoardingCarousel.slide2.description,
            staticImageData: onboarding2Png,
            title: strings.OnBoardingCarousel.slide2.title,
          },
          {
            description: strings.OnBoardingCarousel.slide3.description,
            staticImageData: onboarding3Png,
            title: strings.OnBoardingCarousel.slide3.title,
          },
        ] as Array<OnboardingCarouselItemInfo>
      ).map((onboardingInfo, index) => (
        <OnboardingCarouselItem
          className="keen-slider__slide"
          info={onboardingInfo}
          key={index}
        />
      )),
    [strings],
  );

  const arrowActions = useMemo(() => {
    const maxSlideIndex = slideElements.length - 1;

    return {
      back: match(currentSlideIndex)
        .with(P.number.gte(1), () => "prev" as const)
        .otherwise(() => null),
      forward: match(currentSlideIndex)
        .with(P.number.lt(maxSlideIndex), () => "next" as const)
        .with(maxSlideIndex, () => "start" as const)
        .otherwise(() => null),
    };
  }, [currentSlideIndex, slideElements.length]);

  const onBackButtonClick = useCallback(() => {
    if (arrowActions.back === "prev") {
      keenSliderInstance?.moveToIdx(currentSlideIndex - 1);
    }
  }, [arrowActions.back, currentSlideIndex, keenSliderInstance]);

  const onForwardButtonClick = useCallback(() => {
    if (arrowActions.forward === "next") {
      keenSliderInstance?.moveToIdx(currentSlideIndex + 1);
    } else if (arrowActions.forward === "start") {
      appDispatch({
        preferences: { onboardingCompleted: true },
        type: "updatePreferences",
      });
    }
  }, [
    appDispatch,
    arrowActions.forward,
    currentSlideIndex,
    keenSliderInstance,
  ]);

  return (
    <Box sx={container} {...remainingProps}>
      <>
        <div className="keen-slider" css={slider} ref={keenSliderElementRef}>
          {slideElements}
        </div>

        {keenSliderInstance && (
          <div css={actionsContainer}>
            <OnboardingCarouselButton
              css={carouselButton}
              disabled={!arrowActions.back}
              onClick={onBackButtonClick}
              text={match(arrowActions.back)
                .with("prev", () => strings.OnBoardingCarousel.buttons.prev)
                .otherwise(() => "")}
            />

            <OnboardingCarouselDots
              css={carouselDots}
              currentPageIndex={currentSlideIndex}
              keenSliderInstance={keenSliderInstance}
            />

            <OnboardingCarouselButton
              css={carouselButton}
              onClick={onForwardButtonClick}
              text={match(arrowActions.forward)
                .with("start", () => strings.OnBoardingCarousel.buttons.start)
                .with("next", () => strings.OnBoardingCarousel.buttons.next)
                .otherwise(() => "")}
            />
          </div>
        )}
      </>
    </Box>
  );
});

OnboardingCarousel.displayName = "OnboardingCarousel";

export default OnboardingCarousel;
