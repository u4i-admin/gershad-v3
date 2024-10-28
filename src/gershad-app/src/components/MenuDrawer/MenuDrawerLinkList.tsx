import { StylableFC } from "@asl-19/react-dom-utils";
import List from "@mui/material/List";
import { memo } from "react";

import MenuDrawerLinkListItem, {
  MenuDrawerLinkListItemInfo,
} from "src/components/MenuDrawer/MenuDrawerLinkListItem";

const MenuDrawerLinkList: StylableFC<{
  closeMenuDrawer: () => void;
  itemInfos: Array<MenuDrawerLinkListItemInfo>;
}> = memo(({ closeMenuDrawer, itemInfos }) => (
  <List>
    {itemInfos.map((itemInfo) => (
      <MenuDrawerLinkListItem
        closeMenuDrawer={closeMenuDrawer}
        itemInfo={itemInfo}
        key={`${itemInfo.href}-${itemInfo.text}`}
      />
    ))}
  </List>
));

MenuDrawerLinkList.displayName = "MenuDrawerLinkList";

export default MenuDrawerLinkList;
