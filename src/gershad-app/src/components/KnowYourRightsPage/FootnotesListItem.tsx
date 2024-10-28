import { replaceArabicNumeralsWithPersianNumerals } from "@asl-19/js-utils";
import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { memo } from "react";

import HtmlContent from "src/components/HtmlContent";
import { useAppLocaleInfo } from "src/stores/appStore";
import { Footnote } from "src/types/apiTypes";
import colors from "src/values/colors";

const container = css({
  display: "flex",
  gap: "1rem",
  paddingInlineStart: "1rem",
});
const indexNumber = css({
  color: colors.yellow,
});
const text = css({});

const FootnotesListItem: StylableFC<{
  footnote: Footnote;
  index: number;
}> = memo(({ footnote, index }) => {
  const { localeCode } = useAppLocaleInfo();
  const formattedNumber =
    localeCode === "fa"
      ? replaceArabicNumeralsWithPersianNumerals(`${index + 1}`)
      : index;
  return (
    <Box css={container} id={footnote.uuid}>
      <Typography component="span" css={indexNumber}>
        {formattedNumber}
      </Typography>
      <HtmlContent css={text} dangerousHtml={footnote.text} />
    </Box>
  );
});

FootnotesListItem.displayName = "FootnotesListItem";

export default FootnotesListItem;
