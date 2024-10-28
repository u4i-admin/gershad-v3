import { StylableFC } from "@asl-19/react-dom-utils";
import Button from "@mui/material/Button";
import { memo } from "react";

const FormSubmitButton: StylableFC<{
  disabled?: boolean;
  text: string;
}> = memo(({ className, disabled, text }) => (
  <Button className={className} type="submit" disabled={disabled}>
    {text}
  </Button>
));

FormSubmitButton.displayName = "FormSubmitButton";

export default FormSubmitButton;
