import { StylableFC } from "@asl-19/react-dom-utils";
import ButtonBase from "@mui/material/ButtonBase";
import Link from "next/link";
import { memo } from "react";

import { MuiSx } from "src/types/styleTypes";

const link: MuiSx = [
  ({ zIndex }) => ({
    height: "100%",
    position: "absolute",
    right: "0",
    top: "0",
    width: "100%",
    zIndex: zIndex.linkOverlay_link,
  }),
];

const LinkOverlay: StylableFC<{
  onClick?: () => void;
  url?: string;
}> = memo(({ className, onClick, url }) => {
  const linkProps =
    onClick && !url
      ? {
          onClick,
        }
      : {
          href: url,
          LinkComponent: Link,
        };

  return (
    <ButtonBase
      {...linkProps}
      aria-hidden="true"
      className={className}
      sx={link}
      tabIndex={-1}
    />
  );
});

LinkOverlay.displayName = "LinkOverlay";

export default LinkOverlay;
