import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { memo } from "react";

import BeePassVPNLogoSvg from "src/components/icons/BeePassVPNLogoIcon";
import { useAppStrings } from "src/stores/appStore";
import colors from "src/values/colors";

const stack = css({
  alignItems: "start",
  rowGap: "0.5rem",
});

const beepassDescription = css({
  color: colors.grey,
});

const beepassVPNLogoIcon = css({
  height: "1.5rem",
});

const SettingsPagePoweredByBeePassVpnBadge: StylableFC = memo(() => {
  const strings = useAppStrings();

  return (
    <Stack css={stack}>
      <BeePassVPNLogoSvg css={beepassVPNLogoIcon} />

      <Typography
        css={beepassDescription}
        variant="paraExtraSmallRegular"
        component="p"
      >
        {strings.shared.beepassDescription}
      </Typography>
    </Stack>
  );
});

SettingsPagePoweredByBeePassVpnBadge.displayName = "SettingsPageFooter";

export default SettingsPagePoweredByBeePassVpnBadge;
