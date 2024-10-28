import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import { memo } from "react";

import KnowYourRightsListItem, {
  KnowYourRightsListItemInfo,
} from "src/components/KnowYourRightsPage/KnowYourRightsListItem";

const container = css({});

const KnowYourRightsList: StylableFC<{
  listItemInfos: Array<KnowYourRightsListItemInfo>;
}> = memo(({ className, listItemInfos }) => (
  <Box css={container} className={className}>
    {listItemInfos.map((info) => (
      <KnowYourRightsListItem info={info} key={`${info.id}-${info.title}`} />
    ))}
  </Box>
));

KnowYourRightsList.displayName = "KnowYourRightsList";

export default KnowYourRightsList;
