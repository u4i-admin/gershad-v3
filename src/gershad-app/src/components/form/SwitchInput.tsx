import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import { ChangeEvent, memo, useId } from "react";

import LoadingIndicatorSvg from "src/components/icons/animation/LoadingIndicatorSvg";

const container = css({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  justifyContent: "space-between",
});
const labelContainer = css({
  alignItems: "center",
  display: "flex",
  gap: "0.5rem",
});
const icon = css({
  height: "1.5rem",
});
const SwitchInput: StylableFC<{
  checked: boolean;
  disabled?: boolean;
  formState?: "isNotSubmitting" | "isSubmitting";
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}> = memo(
  ({
    checked,
    disabled = false,
    formState,
    label,
    onChange,
    ...remainingProps
  }) => {
    const switchId = useId();

    return (
      <FormGroup css={container} {...remainingProps}>
        <div css={labelContainer}>
          <label htmlFor={switchId}>{label}</label>

          {formState === "isSubmitting" && <LoadingIndicatorSvg css={icon} />}
        </div>
        <Switch
          checked={checked}
          onChange={onChange}
          id={switchId}
          disabled={disabled}
        />
      </FormGroup>
    );
  },
);

SwitchInput.displayName = "SwitchInput";

export default SwitchInput;
