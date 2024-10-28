import Stack from "@mui/material/Stack";

import AppBarTop from "src/components/AppBarTop";
import PageContent from "src/components/Page/PageContent";
import PageContainer from "src/components/PageContainer";
import PageMeta from "src/components/PageMeta";
import NotificationsPermissionSettingsList from "src/components/SettingsPage/NotificationsSection/NotificationsPermissionSettingsList";
import routeUrls from "src/routeUrls";
import { useAppStrings } from "src/stores/appStore";
import { PageComponent } from "src/utils/createLocalePageComponent";

// =============
// === Types ===
// =============

// ==============================
// === Next.js page component ===
// ==============================

const SettingsNotificationsPage: PageComponent = () => {
  const strings = useAppStrings();

  return (
    <>
      <PageMeta
        canonicalPath={routeUrls.settingsNotifications()}
        title={strings.SettingsPage.title}
      />

      <AppBarTop
        headingText={strings.SettingsPage.title}
        url={routeUrls.settings()}
      />

      <PageContent isScrollable>
        <PageContainer>
          <Stack rowGap="1.5rem" paddingTop="1.5rem">
            <NotificationsPermissionSettingsList />
          </Stack>
        </PageContainer>
      </PageContent>
    </>
  );
};

export default SettingsNotificationsPage;
