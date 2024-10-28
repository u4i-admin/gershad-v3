import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";
import { memo } from "react";

import HtmlContent from "src/components/HtmlContent";
import FootnotesList from "src/components/KnowYourRightsPage/FootnotesList";
import useHtmlWithManagedEmbedScripts from "src/hooks/useHtmlWithManagedEmbedScripts";
import { Footnote } from "src/types/apiTypes";
import colors from "src/values/colors";

const container = css(
  {
    ".footnote-ref": {
      color: colors.yellow,
      counterSet: "",
      cursor: "pointer",
      fontSize: "0",
      position: "relative",
      verticalAlign: "super",
    },

    ".footnote-ref::before": {
      content: "counter(footnotes-counter,persian)",
      counterIncrement: "footnotes-counter",

      fontSize: "0.8rem",
      position: "absolute",
    },

    ".footnote-ref:hover": {
      textDecoration: "underline",
    },

    counterReset: "footnotes-counter",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    paddingBottom: "3rem",
  },
  {
    ".richtext-image": {
      height: "auto",
    },
    ".richtext-image.full-width": {
      objectFit: "contain",
      width: "100%",
    },

    ".richtext-image.left": {
      alignSelf: "flex-end",
      maxWidth: "100%",
    },

    ".richtext-image.right": {
      alignSelf: "flex-start",
      maxWidth: "100%",
    },

    "iframe, .contains-video": {
      maxWidth: "100%",
      width: "100%",
    },
  },
);

const KnowYourRightsChildPageContent: StylableFC<{
  content: string;
  footnotes?: Array<Footnote> | null;
  title: string;
}> = memo(({ content, footnotes, title }) => {
  const { htmlWithoutScripts } = useHtmlWithManagedEmbedScripts({
    html: content,
  });

  const replacedImagesSrcHtml = htmlWithoutScripts.replaceAll(
    "/media/images",
    `${process.env.NEXT_PUBLIC_STORAGE_URL}/media/images`,
  );
  return (
    <>
      <Typography variant="headingH4">{title}</Typography>
      <HtmlContent css={container} dangerousHtml={replacedImagesSrcHtml} />
      {footnotes && footnotes.length > 0 && (
        <FootnotesList footnotes={footnotes} />
      )}
    </>
  );
});

KnowYourRightsChildPageContent.displayName = "KnowYourRightsChildPageContent";

export default KnowYourRightsChildPageContent;
