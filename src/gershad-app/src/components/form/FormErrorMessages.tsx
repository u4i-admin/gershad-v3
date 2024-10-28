import { FormState, StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";
import { memo, RefObject } from "react";

import colors from "src/values/colors";

const errorMessage = css({
  color: colors.orange,
  margin: "0.5rem 0",
});

const FormErrorMessages: StylableFC<{
  errorMessagesListRef: RefObject<HTMLUListElement>;
  formState: FormState;
}> = memo(({ className, errorMessagesListRef, formState }) => {
  if (formState.type !== "hasErrorMessages") {
    return null;
  }

  return (
    <ul className={className} ref={errorMessagesListRef}>
      {formState.errorMessages.map((registerErrorMessage, index) => (
        <li css={errorMessage} key={index}>
          <Typography variant="paraExtraSmallRegular" component="p">
            {registerErrorMessage}
          </Typography>
        </li>
      ))}
    </ul>
  );
});

FormErrorMessages.displayName = "FormErrorMessages";

export default FormErrorMessages;
