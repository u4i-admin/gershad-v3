import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AppBarTop from "src/components/AppBarTop";
import PageContent from "src/components/Page/PageContent";
import PageContainer from "src/components/PageContainer";
import PageMeta from "src/components/PageMeta";
import LanguageSettingSection from "src/components/SettingsPage/LanguageSettingSection";
import NotificationsPermissionSettingsList from "src/components/SettingsPage/NotificationsSection/NotificationsPermissionSettingsList";
import NotificationsSettingsLink from "src/components/SettingsPage/NotificationsSettingsLink";
import P2PSettingSection from "src/components/SettingsPage/P2PSettingSection";
import SettingsPagePoweredByBeePassVpnBadge from "src/components/SettingsPage/SettingsPagePoweredByBeePassVpnBadge";
import UninstallApplicationSection from "src/components/SettingsPage/UninstallApplicationSection";
import routeUrls from "src/routeUrls";
import { useAppStrings } from "src/stores/appStore";
import { PageComponent } from "src/utils/createLocalePageComponent";

// =============
// === Types ===
// =============

export type SettingsPageStrings = {
  placeholderText: string;
  /**
   * Page title. Used in header and SEO tags.
   */
  title: string;
};

// ==============================
// === Next.js page component ===
// ==============================

const SettingsPage: PageComponent = () => {
  const strings = useAppStrings();
  return (
    <>
      <PageMeta
        canonicalPath={routeUrls.settings()}
        title={strings.SettingsPage.title}
      />

      <AppBarTop
        headingText={strings.SettingsPage.title}
        url={routeUrls.home()}
      />

      <PageContent isScrollable>
        <PageContainer>
          <Stack rowGap="1.5rem" paddingTop="1.5rem">
            {process.env.NEXT_PUBLIC_ENABLE_P2P && <P2PSettingSection />}

            {process.env.NEXT_PUBLIC_ENABLE_BACKGROUND_GEOLOCATION ? (
              process.env
                .NEXT_PUBLIC_ENABLE_SETTINGS_DEDICATED_NOTIFICATIONS_PAGE ? (
                <NotificationsSettingsLink />
              ) : (
                <>
                  {process.env.NEXT_PUBLIC_ENABLE_P2P && <Divider />}

                  <NotificationsPermissionSettingsList />
                </>
              )
            ) : (
              <Typography>
                Background location sharing and notifications temporarily
                disabled in iOS version.
              </Typography>
            )}

            {process.env.NEXT_PUBLIC_ANDROID_FLAVOR === "independent" && (
              <>
                {process.env.NEXT_PUBLIC_ENABLE_BACKGROUND_GEOLOCATION && (
                  <Divider />
                )}

                <UninstallApplicationSection />
              </>
            )}

            {process.env
              .NEXT_PUBLIC_ENABLE_SETTINGS_PAGE_POWERED_BY_BEEPASS_VPN_BADGE && (
              <>
                <Divider />

                <SettingsPagePoweredByBeePassVpnBadge />
              </>
            )}

            {process.env.NEXT_PUBLIC_ENABLE_LANGUAGE && (
              <>
                <Divider />

                <LanguageSettingSection />
              </>
            )}
          </Stack>
        </PageContainer>
      </PageContent>
    </>
  );
};

export default SettingsPage;
