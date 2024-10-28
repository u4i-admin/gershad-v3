import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import {
  AriaAttributes,
  ChangeEventHandler,
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
} from "react";

import colors from "src/values/colors";

const formInput = css({
  "::placeholder": {
    color: colors.grey,
  },
  ":focus": {
    borderColor: colors.yellow,
  },
  borderBottom: `1px solid ${colors.grey}`,
  height: "2.25rem",
  width: "100%",
});

const FormTextAreaAutosize: StylableFC<
  {
    disabled?: boolean;
    id?: string;
    placeholder?: string;
    required?: boolean;
    setValue: Dispatch<SetStateAction<string | number>>;
    value: string | number;
  } & AriaAttributes
> = memo(
  ({
    className,
    disabled = false,
    id,
    placeholder,
    required,
    setValue,
    value,
    ...ariaAttributes
  }) => {
    const onChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
      (event) => {
        setValue(event.target.value);
      },
      [setValue],
    );

    return (
      <TextareaAutosize
        className={className}
        css={formInput}
        id={id}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        {...ariaAttributes}
      />
    );
  },
);

FormTextAreaAutosize.displayName = "FormTextAreaAutosize";

export default FormTextAreaAutosize;
