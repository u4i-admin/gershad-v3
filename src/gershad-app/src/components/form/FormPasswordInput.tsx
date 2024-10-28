import { StylableFC } from "@asl-19/react-dom-utils";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import {
  AriaAttributes,
  ChangeEventHandler,
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { formInput } from "src/styles/formStyles";

const FormPasswordInput: StylableFC<
  {
    disabled?: boolean;
    id?: string;
    placeholder?: string;
    required?: boolean;
    setValue: Dispatch<SetStateAction<string>>;
    value: string;
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
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      event.preventDefault();
    };

    const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      (event) => {
        setValue(event.target.value);
      },
      [setValue],
    );

    const EndAdornment = useMemo(
      // eslint-disable-next-line react-memo/require-memo
      () => (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
      [showPassword],
    );

    return (
      <Input
        className={className}
        css={formInput}
        type={showPassword ? "text" : "password"}
        id={id}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        endAdornment={EndAdornment}
        {...ariaAttributes}
      />
    );
  },
);

FormPasswordInput.displayName = "FormPasswordInput";

export default FormPasswordInput;
