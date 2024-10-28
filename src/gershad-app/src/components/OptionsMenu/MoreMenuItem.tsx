import { StylableFC } from "@asl-19/react-dom-utils";
import MenuItem from "@mui/material/MenuItem";
import { memo, useCallback } from "react";

export type MoreMenuItemOption = {
  name: string;
  onClick: () => void;
};

const MoreMenuItem: StylableFC<{
  closeMenu: () => void;
  option: MoreMenuItemOption;
}> = memo(({ closeMenu, option }) => {
  const onMeuOptionsClick = useCallback(() => {
    option.onClick();
    closeMenu();
  }, [closeMenu, option]);

  return <MenuItem onClick={onMeuOptionsClick}>{option.name}</MenuItem>;
});

MoreMenuItem.displayName = "MoreMenuItem";

export default MoreMenuItem;
