import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { PopoverOrigin } from "@mui/material/Popover";
import { memo, useCallback, useId, useMemo, useRef, useState } from "react";
import { match } from "ts-pattern";

import MoreMenuItem, {
  MoreMenuItemOption,
} from "src/components/OptionsMenu/MoreMenuItem";
import colors from "src/values/colors";

const icon = css({
  color: colors.black,
});

const MoreMenu: StylableFC<{
  horizontalAlignment: "start" | "end";
  options: Array<MoreMenuItemOption>;
}> = memo(({ horizontalAlignment, options, ...remainingProps }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const menuElementId = useId();
  const iconButtonElementRef = useRef<HTMLButtonElement>(null);

  const menuOriginProps = useMemo<{
    anchorOrigin: PopoverOrigin;
    transformOrigin: PopoverOrigin;
  }>(() => {
    const horizontal = match(horizontalAlignment)
      .with("end", () => "right" as const)
      .with("start", () => "left" as const)
      .exhaustive();

    return {
      anchorOrigin: { horizontal, vertical: "bottom" },
      transformOrigin: { horizontal, vertical: "top" },
    };
  }, [horizontalAlignment]);

  return (
    <>
      <IconButton
        aria-controls={menuElementId}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={openMenu}
        ref={iconButtonElementRef}
        {...remainingProps}
      >
        <MoreVertIcon css={icon} />
      </IconButton>

      <Menu
        anchorEl={iconButtonElementRef.current}
        id={menuElementId}
        open={isOpen}
        onClose={closeMenu}
        {...menuOriginProps}
      >
        {options.map((option) => (
          <MoreMenuItem
            closeMenu={closeMenu}
            option={option}
            key={option.name}
          />
        ))}
      </Menu>
    </>
  );
});

MoreMenu.displayName = "MoreMenu";

export default MoreMenu;
