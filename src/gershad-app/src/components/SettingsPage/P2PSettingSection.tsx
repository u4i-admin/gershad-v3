import { StylableFC } from "@asl-19/react-dom-utils";
import { memo, useCallback } from "react";

import SwitchInput from "src/components/form/SwitchInput";
import SettingsPageSection from "src/components/SettingsPage/SettingsPageSection";
import {
  useAppDispatch,
  useAppPreferencesP2pEnabled,
  useAppStrings,
} from "src/stores/appStore";

export type P2PSettingSectionStrings = {
  /**
   * Text for P2P setting
   */
  p2p: string;
};

const P2PSettingSection: StylableFC<{}> = memo(() => {
  const { P2PSettingSection: strings } = useAppStrings();
  const dispatch = useAppDispatch();

  const enableP2P = useAppPreferencesP2pEnabled();

  const handleUserNearbySettingChange = useCallback(() => {
    dispatch({
      preferences: {
        p2pEnabled: !enableP2P,
      },
      type: "updatePreferences",
    });
  }, [dispatch, enableP2P]);

  return (
    <SettingsPageSection
      headingIsVisible={false}
      headingLevel={2}
      headingText=""
    >
      <SwitchInput
        label={strings.p2p}
        checked={enableP2P ?? false}
        onChange={handleUserNearbySettingChange}
      />
    </SettingsPageSection>
  );
});

P2PSettingSection.displayName = "P2PSettingSection";

export default P2PSettingSection;
