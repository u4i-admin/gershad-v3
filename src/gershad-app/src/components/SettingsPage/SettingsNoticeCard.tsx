import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { memo } from "react";

import colors from "src/values/colors";

const noticeCard = css({
  backgroundColor: colors.lightGrey,
});

const SettingsNoticeCard: StylableFC<
  {
    bodyText: string;
  } & (
    | {
        buttonHref?: never;
        buttonOnClick: () => void;
        buttonText: string;
      }
    | {
        buttonHref: string;
        buttonOnClick?: never;
        buttonText: string;
      }
    | {
        buttonHref?: never;
        buttonOnClick?: never;
        buttonText?: never;
      }
  )
> = memo(({ bodyText, buttonHref, buttonOnClick, buttonText }) => (
  <Card css={noticeCard} variant="outlined">
    <CardContent>
      <Typography variant="body1">{bodyText}</Typography>
    </CardContent>
    {buttonText && (
      <CardActions>
        <Button href={buttonHref} onClick={buttonOnClick}>
          {buttonText}
        </Button>
      </CardActions>
    )}
  </Card>
));

SettingsNoticeCard.displayName = "SettingsNoticeCard";

export default SettingsNoticeCard;
