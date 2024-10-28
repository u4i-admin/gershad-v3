import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import { match, P } from "ts-pattern";

import ChevronSvg from "src/components/icons/ChevronSvg";
import { GqlUserGuideQuestionBlock } from "src/generated/graphQl";

const chevronIcon = css({
  height: "1rem",
  transform: "rotate(90deg)",
});
const icon = css({
  flex: "0 0 2rem",
  height: "2rem",
  objectFit: "contain",
  stroke: "transparent",
  width: "2rem",
});
const summary = css({
  alignItems: "center",
  columnGap: "0.5rem",
  display: "flex",
  whiteSpace: "pre-line",
  width: "100%",
});

const text = css({
  flexGrow: 1,
  fontWeight: "bold",
});

const accordion = css({
  // Override:
  //
  // - https://github.com/mui/material-ui/blob/7aa3fab10217d0a4c4ac2bd82d0ef5b80d6b18e9/packages/mui-material/src/Accordion/Accordion.js#L73
  //   (Don’t hide border when expanded)
  // - https://github.com/mui/material-ui/blob/7aa3fab10217d0a4c4ac2bd82d0ef5b80d6b18e9/packages/mui-material/src/Accordion/Accordion.js#L58
  //   (Move border to bottom since we want border below last item)
  "&:before": {
    bottom: "0",
    opacity: "1 !important",
    top: "unset",
  },
  // Override:
  //
  // - https://github.com/mui/material-ui/blob/7aa3fab10217d0a4c4ac2bd82d0ef5b80d6b18e9/packages/mui-material/src/Accordion/Accordion.js#L66
  //   (Disable hiding first border since we’ve moved border from top to bottom
  //   above)
  "&:first-of-type": {
    "&:before": {
      display: "unset",
    },
  },
});

const description = css({
  paddingInlineStart: "4rem",
  whiteSpace: "pre-line",
});

const chevronElement = <ChevronSvg css={chevronIcon} direction="start" />;

const UserGuideAccordion: StylableFC<{
  question: GqlUserGuideQuestionBlock;
}> = memo(({ question }) => {
  const iconUrl = `${process.env.NEXT_PUBLIC_STORAGE_URL}${question.icon.image?.rendition?.url}`;

  return (
    <Accordion disableGutters elevation={0} css={accordion}>
      <AccordionSummary expandIcon={chevronElement} disableRipple={false}>
        <div css={summary}>
          {match(question.icon.image)
            .with(
              { rendition: { height: P.number, width: P.number } },
              (iconImage) => (
                <img
                  alt=""
                  css={icon}
                  height={iconImage.rendition.height}
                  src={iconUrl}
                  width={iconImage.rendition?.width}
                />
              ),
            )
            .otherwise(() => null)}
          <Typography css={text} component="p" variant="paraMedium">
            {question.question}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Typography css={description}>{question.answer}</Typography>
      </AccordionDetails>
    </Accordion>
  );
});

UserGuideAccordion.displayName = "UserGuideAccordion";

export default UserGuideAccordion;
