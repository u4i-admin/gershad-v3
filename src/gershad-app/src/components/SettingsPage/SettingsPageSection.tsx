import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { memo, ReactNode, useId } from "react";

import { invisible } from "src/styles/generalStyles";
import { HeadingLevel, HeadingTagName } from "src/types/miscTypes";
import colors from "src/values/colors";

const sectionHeading = css({
  color: colors.grey,
});

const SettingsPageSection: StylableFC<{
  children: ReactNode;
  headingIsVisible?: boolean;
  headingLevel: HeadingLevel;
  headingText: string;
}> = memo(
  ({
    children,
    headingIsVisible = true,
    headingLevel,
    headingText,
    ...remainingProps
  }) => {
    const headingId = useId();
    const HeadingTag = `h${headingLevel}` as HeadingTagName;

    return (
      <Stack
        aria-labelledby={headingId}
        component="section"
        rowGap="1rem"
        {...remainingProps}
      >
        <HeadingTag
          css={headingIsVisible ? sectionHeading : invisible}
          id={headingId}
        >
          <Typography variant="paraSmall" component="p">
            {headingText}
          </Typography>
        </HeadingTag>

        {children}
      </Stack>
    );
  },
);

SettingsPageSection.displayName = "SettingsPageSection";

export default SettingsPageSection;
