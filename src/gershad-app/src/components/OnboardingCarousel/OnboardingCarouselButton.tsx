import { StylableFC } from "@asl-19/react-dom-utils";
import Button from "@mui/material/Button";
import { memo } from "react";

const OnboardingCarouselButton: StylableFC<{
  disabled?: boolean;
  onClick: () => void;
  text: string;
}> = memo(({ disabled, onClick, text, ...remainingProps }) => (
  <Button aria-hidden disabled={disabled} onClick={onClick} {...remainingProps}>
    {text}
  </Button>
));

OnboardingCarouselButton.displayName = "OnboardingCarouselButton";

export default OnboardingCarouselButton;
