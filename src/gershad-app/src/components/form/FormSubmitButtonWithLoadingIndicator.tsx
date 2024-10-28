import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useMemo } from "react";

import LoadingIndicatorSvg from "src/components/icons/animation/LoadingIndicatorSvg";
import { useAppStrings } from "src/stores/appStore";
import { ButtonSize } from "src/types/buttonTypes";
import announce from "src/utils/announce";
import { buttonHeights } from "src/values/layoutValues";

export type FormSubmitButtonWithLoadingIndicatorStrings = {
  /**
   * Label text for button `Submitting` for accessibility purposes
   */
  submittingA11yLabel: string;
};

const FormSubmitButtonWithLoadingIndicator: StylableFC<{
  buttonSize: ButtonSize;
  isSubmitting: boolean;
  text: string;
}> = memo(({ buttonSize, isSubmitting, text, ...remainingProps }) => {
  const strings = useAppStrings();

  // Scale the loading indicator proportionally to the size of the button.
  const loadingIndicatorStyles = useMemo(() => {
    const size = `calc(${buttonHeights[buttonSize]} - 1rem)`;

    return css({
      height: size,
      scale: "1.5",
      width: size,
    });
  }, [buttonSize]);

  // Announce loading (aria-label dynamically changing doesn’t seem to be
  // announced, at least in VoiceOver).
  useEffect(() => {
    if (isSubmitting) {
      announce({
        priority: "assertive",
        text: strings.FormSubmitButtonWithLoadingIndicator.submittingA11yLabel,
      });
    }
  }, [isSubmitting, strings]);

  return (
    <Button
      variant="contained"
      disabled={isSubmitting}
      aria-label={
        isSubmitting
          ? strings.FormSubmitButtonWithLoadingIndicator.submittingA11yLabel
          : ""
      }
      {...remainingProps}
      type="submit"
    >
      {isSubmitting ? (
        <LoadingIndicatorSvg css={loadingIndicatorStyles} />
      ) : (
        <Typography variant="paraSmall" component="p">
          {text}
        </Typography>
      )}
    </Button>
  );
});

FormSubmitButtonWithLoadingIndicator.displayName =
  "FormSubmitButtonWithLoadingIndicator";

export default FormSubmitButtonWithLoadingIndicator;
