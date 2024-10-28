import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { memo, useCallback, useMemo } from "react";

import SettingsPageSection from "src/components/SettingsPage/SettingsPageSection";
import routeUrls from "src/routeUrls";
import { useAppDispatch, useAppLocaleInfo } from "src/stores/appStore";
import getLocaleMetadata from "src/utils/getLocaleMetadata";
import reloadAppUi from "src/utils/reloadAppUi";
import { LocaleCode } from "src/values/localeValues";
import { enabledLocaleCodes } from "src/values/localeValues";

const container = css({
  display: "flex",
  gap: "2rem",
});

const LanguageSettingSection: StylableFC<{}> = memo(() => {
  const appDispatch = useAppDispatch();
  const { localeCode } = useAppLocaleInfo();

  const changeLocale = useCallback(
    ({ localeCode }: { localeCode: LocaleCode }) => {
      appDispatch({
        preferences: { localeCode },
        type: "updatePreferences",
      });

      reloadAppUi({ initialPath: routeUrls.settings() });
    },
    [appDispatch],
  );

  const onEnglishButtonClick = useCallback(
    () => changeLocale({ localeCode: "en" }),
    [changeLocale],
  );
  const onPersianButtonClick = useCallback(
    () => changeLocale({ localeCode: "fa" }),
    [changeLocale],
  );

  const languageInfos = useMemo(
    () =>
      enabledLocaleCodes.map((localeCode) => {
        const { nativeName } = getLocaleMetadata(localeCode);

        return {
          localeCode,
          nativeName,
        };
      }),
    [],
  );

  return (
    <SettingsPageSection headingLevel={2} headingText={"Language"}>
      <Box css={container}>
        {languageInfos.map((languageInfo) => (
          <Button
            variant="contained"
            onClick={
              localeCode === "en" ? onPersianButtonClick : onEnglishButtonClick
            }
            disabled={languageInfo.localeCode === localeCode}
            key={languageInfo.localeCode}
          >
            {languageInfo.nativeName}
          </Button>
        ))}
      </Box>
    </SettingsPageSection>
  );
});

LanguageSettingSection.displayName = "LanguageSettingSection";

export default LanguageSettingSection;
