import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, { StandardTextFieldProps } from "@mui/material/TextField";
import {
  ChangeEventHandler,
  Dispatch,
  memo,
  MouseEventHandler,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
} from "react";

import CrossSvg from "src/components/icons/CrossSvg";
import SearchSvg from "src/components/icons/SearchSvg";
import LinkOverlay from "src/components/LinkOverlay";
import { useAppStrings } from "src/stores/appStore";
import focusElement from "src/utils/focus/focusElement";
import colors from "src/values/colors";

export type SearchBoxStrings = {
  /**
   * Text for search box place holder
   */
  placeholder: string;
};

const container = css({
  border: "none",
  position: "relative",
});

const icon = css({
  height: "1rem",
});

const textField = css([
  {
    backgroundColor: colors.white,
    borderRadius: "0.25rem",
    width: "100%",
  },
  {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "transparent",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;",
      },
      "&.Mui-focused fieldset": {
        borderColor: "transparent",
      },
    },
    ".MuiInputBase-input": {
      border: "none",
      padding: "0.675rem 0",
    },
  },
]);

const SearchBox: StylableFC<
  | {
      searchQuery: string;
      setSearchQuery: Dispatch<SetStateAction<string>>;
      url?: never;
    }
  | {
      searchQuery?: string;
      setSearchQuery?: never;
      url: string;
    }
> = memo(
  ({ className, searchQuery, setSearchQuery, url, ...remainingProps }) => {
    const searchInputRef = useRef<HTMLInputElement>(null);

    const strings = useAppStrings();

    const onClearButtonClick = useCallback<
      MouseEventHandler<HTMLButtonElement>
    >(() => {
      if (setSearchQuery) setSearchQuery("");

      if (searchInputRef.current) {
        focusElement(searchInputRef.current);
      }
    }, [setSearchQuery]);

    const onSearchInputChange = useCallback<
      ChangeEventHandler<HTMLInputElement>
    >(
      (event) => {
        if (setSearchQuery) setSearchQuery(event.target.value);
      },
      [setSearchQuery],
    );

    const textFieldInputProps: StandardTextFieldProps["InputProps"] = useMemo(
      // eslint-disable-next-line react-memo/require-memo
      () => ({
        endAdornment: searchQuery ? (
          <IconButton onClick={onClearButtonClick}>
            <CrossSvg css={icon} />
          </IconButton>
        ) : undefined,
        startAdornment: (
          <InputAdornment position="start">
            <SearchSvg css={icon} />
          </InputAdornment>
        ),
      }),
      [onClearButtonClick, searchQuery],
    );

    return (
      <Box className={className} {...remainingProps} css={container}>
        <TextField
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={!url}
          placeholder={strings.SearchBox.placeholder}
          css={textField}
          InputProps={textFieldInputProps}
          value={searchQuery}
          ref={searchInputRef}
          onChange={onSearchInputChange}
        />
        {url && <LinkOverlay url={url} />}
      </Box>
    );
  },
);

SearchBox.displayName = "SearchBox";

export default SearchBox;
