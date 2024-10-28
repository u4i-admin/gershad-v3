import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { memo } from "react";

import FootnotesListItem from "src/components/KnowYourRightsPage/FootnotesListItem";
import { useAppStrings } from "src/stores/appStore";
import { Footnote } from "src/types/apiTypes";
import colors from "src/values/colors";

export type FootnotesListStrings = {
  /**
   * Text for footnotes section heading
   */
  footnotes: string;
};

const container = css({
  borderTop: `1px solid ${colors.lightGrey}`,
  padding: "2rem 0",
});

const footnotesContainer = css({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "1rem 0",
});

const FootnotesList: StylableFC<{
  footnotes: Array<Footnote>;
}> = memo(({ className, footnotes }) => {
  const { FootnotesList: strings } = useAppStrings();
  return (
    <Box css={container} className={className}>
      <Typography variant="headingH4">{strings.footnotes}</Typography>
      <div css={footnotesContainer}>
        {footnotes.map((footnote, index) => (
          <FootnotesListItem footnote={footnote} key={index} index={index} />
        ))}
      </div>
    </Box>
  );
});

FootnotesList.displayName = "FootnotesList";

export default FootnotesList;
