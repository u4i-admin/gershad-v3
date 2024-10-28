import { StylableFC } from "@asl-19/react-dom-utils";
import Input from "@mui/material/Input";
import {
  AriaAttributes,
  ChangeEventHandler,
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
} from "react";

import { formInput } from "src/styles/formStyles";

const FormInput: StylableFC<
  {
    disabled?: boolean;
    id?: string;
    placeholder?: string;
    required?: boolean;
    setValue: Dispatch<SetStateAction<string | number>>;
    type?: "number" | "text";
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
    type = "text",
    value,
    ...ariaAttributes
  }) => {
    const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      (event) => {
        setValue(event.target.value);
      },
      [setValue],
    );

    return (
      <Input
        className={className}
        css={formInput}
        type={type}
        id={id}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...ariaAttributes}
      />
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;
