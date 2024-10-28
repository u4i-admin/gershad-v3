import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { memo, useCallback, useMemo } from "react";
import { match, P } from "ts-pattern";

import SwitchInput from "src/components/form/SwitchInput";
import NoticeBox from "src/components/NoticeBox";
import NotificationsPrerequisitesNotice from "src/components/SettingsPage/NotificationsSection/NotificationsPrerequisitesNotice";
import NotificationsPrerequisitesNoticeFunctionalityExplanation from "src/components/SettingsPage/NotificationsSection/NotificationsPrerequisitesNoticeFunctionalityExplanation";
import SettingsPageSection from "src/components/SettingsPage/SettingsPageSection";
import {
  useAppBackgroundGeolocationProviderState,
  useAppDispatch,
  useAppLocalNotificationsPermissionState,
  useAppMotionPermissionState,
  useAppPreferencesBackgroundGeolocationEnabled,
  useAppPreferencesHotZoneEnteredNotificationsEnabled,
  useAppPreferencesNewReportsNearDeviceNotificationsEnabled,
  useAppPreferencesNewReportsNearPoiNotificationsEnabled,
  useAppStrings,
} from "src/stores/appStore";
import {
  logEnableNotifEnterHotZone,
  logEnableNotifReportNearSavedLocations,
  logEnableNotifReportNearYou,
} from "src/utils/firebaseAnalytics";
import colors from "src/values/colors";

export type NotificationsPermissionSettingsListStrings = {
  /**
   * "Background location sharing" section.
   */
  backgroundLocationSharingSection: {
    /**
     * Notice that’s displayed if the user has granted the permissions required to
     * enable background location sharing, but hasn’t enabled background location
     * sharing.
     */
    disabledNotice: string;

    /**
     * Heading of section.
     */
    heading: string;
  };
  /**
   * "Notifications" section
   */
  notificationsSection: {
    /**
     * Text for Notifications Setting Section Heading
     */
    heading: string;

    labels: {
      /**
       * Text For Hot Zone Entering switch label
       */
      enteringHotZone: string;

      /**
       * Text for new report close to user location switch label
       */
      newReportCloseToYou: string;

      /**
       * Text for new report close to bookmarked location switch label
       */
      newReportCloseToYourBookmarkedLocation: string;
    };

    /**
     * Toasts (notifications that appear at the bottom of the screen).
     */
    toasts: {
      /**
       * Toast that appears if the user tries to enable a notification but
       * denies the notifications permission when prompted.
       */
      mustEnableNotificationsPermission: string;
    };
  };
};

const noticeBox = css({
  rowGap: "1rem",
});

const NotificationsPermissionSettingsList: StylableFC<{}> = memo(() => {
  const appDispatch = useAppDispatch();
  const strings = useAppStrings();

  const preferencesBackgroundGeolocationEnabled =
    useAppPreferencesBackgroundGeolocationEnabled();

  const newReportsNearDeviceNotificationsEnabled =
    useAppPreferencesNewReportsNearDeviceNotificationsEnabled();

  const newReportsNearPoiNotificationsEnabled =
    useAppPreferencesNewReportsNearPoiNotificationsEnabled();

  const hotZoneEnteredNotificationsEnabled =
    useAppPreferencesHotZoneEnteredNotificationsEnabled();

  const backgroundGeolocationProviderState =
    useAppBackgroundGeolocationProviderState();
  const appLocalNotificationsPermissionState =
    useAppLocalNotificationsPermissionState();
  const motionPermissionState = useAppMotionPermissionState();

  const notificationSettings = useMemo(
    () =>
      [
        {
          key: "newReportsNearDeviceNotificationsEnabled",
          label:
            strings.NotificationsPermissionSettingsList.notificationsSection
              .labels.newReportCloseToYou,
          notificationEnabled: newReportsNearDeviceNotificationsEnabled,
        },
        {
          key: "hotZoneEnteredNotificationsEnabled",
          label:
            strings.NotificationsPermissionSettingsList.notificationsSection
              .labels.enteringHotZone,
          notificationEnabled: hotZoneEnteredNotificationsEnabled,
        },
        {
          key: "newReportsNearPoiNotificationsEnabled",
          label:
            strings.NotificationsPermissionSettingsList.notificationsSection
              .labels.newReportCloseToYourBookmarkedLocation,
          notificationEnabled: newReportsNearPoiNotificationsEnabled,
        },
      ] as const,
    [
      hotZoneEnteredNotificationsEnabled,
      newReportsNearDeviceNotificationsEnabled,
      newReportsNearPoiNotificationsEnabled,
      strings,
    ],
  );

  const handleNotificationChange = useCallback(
    async ({ setting }: { setting: (typeof notificationSettings)[number] }) => {
      const newValue = !setting.notificationEnabled;

      appDispatch({
        preferences: {
          [setting.key]: newValue,
        },
        type: "updatePreferences",
      });

      match({ newValue, setting })
        .with({ newValue: false }, () => null)
        .with({ setting: { key: "hotZoneEnteredNotificationsEnabled" } }, () =>
          logEnableNotifEnterHotZone(),
        )
        .with(
          { setting: { key: "newReportsNearDeviceNotificationsEnabled" } },
          () => logEnableNotifReportNearYou(),
        )
        .with(
          { setting: { key: "newReportsNearPoiNotificationsEnabled" } },
          () => logEnableNotifReportNearSavedLocations(),
        )
        .exhaustive();
    },
    [appDispatch],
  );

  const onBackgroundGeolocationEnabledChange = useCallback(() => {
    appDispatch({
      preferences: {
        backgroundGeolocationEnabled: !preferencesBackgroundGeolocationEnabled,
      },
      type: "updatePreferences",
    });
  }, [appDispatch, preferencesBackgroundGeolocationEnabled]);

  /**
   * Local notifications permission is either "granted" or "prompt" (if prompt
   * it can be requested when toggled)
   */
  const localNotificationsPermissionIsGranted =
    appLocalNotificationsPermissionState === "granted";

  const locationAlwaysPermissionIsGranted =
    backgroundGeolocationProviderState.always === true;

  const motionPermissionIsGranted = motionPermissionState === "granted";

  const backgroundGeolocationPreferenceCanBeEnabled =
    localNotificationsPermissionIsGranted &&
    locationAlwaysPermissionIsGranted &&
    motionPermissionIsGranted;

  const notificationPreferencesCanBeEnabled =
    backgroundGeolocationPreferenceCanBeEnabled &&
    preferencesBackgroundGeolocationEnabled;

  return (
    <SettingsPageSection
      headingLevel={2}
      headingText={
        strings.NotificationsPermissionSettingsList
          .backgroundLocationSharingSection.heading
      }
    >
      <NoticeBox css={noticeBox}>
        <SwitchInput
          disabled={!backgroundGeolocationPreferenceCanBeEnabled}
          label={
            strings.NotificationsPermissionSettingsList
              .backgroundLocationSharingSection.heading
          }
          checked={preferencesBackgroundGeolocationEnabled}
          onChange={onBackgroundGeolocationEnabledChange}
        />

        <Divider />

        <Box>
          {match({
            backgroundGeolocationPreferenceCanBeEnabled,
            preferencesBackgroundGeolocationEnabled,
          })
            .with(
              {
                backgroundGeolocationPreferenceCanBeEnabled: false,
                preferencesBackgroundGeolocationEnabled: P.any,
              },
              () => (
                <NotificationsPrerequisitesNotice
                  localNotificationsPermissionState={
                    appLocalNotificationsPermissionState
                  }
                  locationAlwaysPermissionState={
                    backgroundGeolocationProviderState
                  }
                  motionPermissionState={motionPermissionState}
                />
              ),
            )
            .with(
              {
                backgroundGeolocationPreferenceCanBeEnabled: true,
                preferencesBackgroundGeolocationEnabled: P.any,
              },
              () => (
                <NotificationsPrerequisitesNoticeFunctionalityExplanation />
              ),
            )
            .exhaustive()}
        </Box>
      </NoticeBox>

      <Divider />

      <h2>
        <Typography variant="paraSmall" component="p" color={colors.grey}>
          {
            strings.NotificationsPermissionSettingsList.notificationsSection
              .heading
          }
        </Typography>
      </h2>

      <Box>
        {notificationSettings.map((setting) => (
          <div key={setting.key}>
            <SwitchInput
              disabled={!notificationPreferencesCanBeEnabled}
              key={setting.key}
              label={setting.label}
              checked={setting.notificationEnabled}
              // eslint-disable-next-line react-memo/require-usememo
              onChange={() => handleNotificationChange({ setting })}
            />
          </div>
        ))}
      </Box>
    </SettingsPageSection>
  );
});

NotificationsPermissionSettingsList.displayName =
  "NotificationsPermissionSettingsList";

export default NotificationsPermissionSettingsList;
