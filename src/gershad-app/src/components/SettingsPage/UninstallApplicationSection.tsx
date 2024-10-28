import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import { FC, memo, useCallback } from "react";

import SwitchInput from "src/components/form/SwitchInput";
import SettingsPageSection from "src/components/SettingsPage/SettingsPageSection";
import {
  useAppDispatch,
  useAppPreferencesUninstallApplicationEnabled,
  useAppStrings,
} from "src/stores/appStore";
import { logEnableUninstallFeature } from "src/utils/firebaseAnalytics";

export type UninstallApplicationSectionStrings = {
  /**
   * Text for UninstallApplication Setting Section Heading
   */
  heading: string;

  /**
   * Text for uninstall application switch label
   */
  uninstallApplicationFromMenu: string;
};

const container = css({});

const UninstallApplicationSection: FC = memo(() => {
  const { UninstallApplicationSection: strings } = useAppStrings();
  const dispatch = useAppDispatch();

  const uninstallApplicationEnabled =
    useAppPreferencesUninstallApplicationEnabled();

  const handleUninstallApplicationEnabledChanged = useCallback(async () => {
    const newValue = !uninstallApplicationEnabled;

    dispatch({
      preferences: {
        uninstallApplicationEnabled: newValue,
      },
      type: "updatePreferences",
    });

    if (newValue === true) {
      logEnableUninstallFeature();
    }
  }, [dispatch, uninstallApplicationEnabled]);

  return (
    <SettingsPageSection headingLevel={2} headingText={strings.heading}>
      <Box css={container}>
        <SwitchInput
          label={strings.uninstallApplicationFromMenu}
          checked={uninstallApplicationEnabled ?? false}
          onChange={handleUninstallApplicationEnabledChanged}
        />
      </Box>
    </SettingsPageSection>
  );
});

UninstallApplicationSection.displayName = "UninstallApplicationSection";

export default UninstallApplicationSection;
