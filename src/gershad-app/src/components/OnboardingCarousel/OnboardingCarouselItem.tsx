import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";
import Image, { StaticImageData } from "next/image";
import { memo } from "react";

export type OnboardingCarouselItemInfo = {
  description: string;
  staticImageData: StaticImageData;
  title: string;
};

const container = css({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "1rem",
  rowGap: "1rem",
  textAlign: "center",
  width: "100%",
});
const icon = css({
  height: "11.25rem",
  width: "auto",
});
const text = css({
  lineHeight: "1.6",
});

const OnboardingCarouselItem: StylableFC<{ info: OnboardingCarouselItemInfo }> =
  memo(({ className, info: { description, staticImageData, title } }) => (
    <div className={className} css={container}>
      <Image alt="" css={icon} src={staticImageData} />
      <Typography variant="headingH2">{title}</Typography>
      <Typography css={text} variant="paraMedium">
        {description}
      </Typography>
    </div>
  ));

OnboardingCarouselItem.displayName = "OnboardingCarouselItem";

export default OnboardingCarouselItem;
