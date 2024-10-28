import { PermissionState } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
} from "capacitor-native-settings";
import { memo, useCallback } from "react";

import NotificationsPrerequisitesNoticeListItem from "src/components/SettingsPage/NotificationsSection/NotificationsPrerequisitesNoticePermissionsListItem";
import GershadCheckPermissionsPlugin from "src/plugins/GershadCheckPermissionsPlugin";
import { useAppDispatch, useAppStrings } from "src/stores/appStore";
import { BackgroundGeolocationProviderState } from "src/utils/backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState";
import useRequestGeoLocationPermissionAndUpdateAppStoreIfChanged from "src/utils/geoLocation/checkAndRequestGeoLocationPermissions";
import { platform } from "src/values/appValues";

export type NotificationsPrerequisitesNoticeStrings = {
  android: {
    /**
     * Label indicating where in the Android Settings app’s app permissions
     * section the user can find the "Location" permission, and what it should
     * be set to.
     */
    locationAlwaysPermissionLabel: string;
    /**
     * Label indicating where in the Android Settings app’s app permissions
     * section the user can find the "Notifications" permission, and what it
     * should be set to.
     */
    notificationsPermissionLabel: string;
    /**
     * Label indicating where in the Android Settings app’s app permissions
     * section the user can find the "Physical activity" permission, and what it
     * should be set to.
     */
    physicalActivityPermissionLabel: string;
  };
  ios: {
    /**
     * Label indicating where in the iOS Settings app’s app permissions section
     * the user can find the "Location" permission, and what it should be set
     * to.
     */
    locationAlwaysPermissionLabel: string;
    /**
     * Label indicating where in the iOS Settings app’s app permissions section
     * the user can find the "Motion & Fitness" permission, and what it should
     * be set to.
     */
    motionAndFitnessPermissionLabel: string;
    /**
     * Label indicating where in the iOS Settings app’s app permissions section
     * the user can find the "Notifications" permission, and what it should be
     * set to.
     */
    notificationsPermissionLabel: string;
  };
};

const NotificationsPrerequisitesNotice = memo(
  ({
    localNotificationsPermissionState,
    locationAlwaysPermissionState,
    motionPermissionState,
  }: {
    localNotificationsPermissionState: PermissionState;
    locationAlwaysPermissionState: BackgroundGeolocationProviderState;
    motionPermissionState: PermissionState;
  }) => {
    const strings = useAppStrings();
    const requestGeoLocationPermissionAndUpdateAppStoreIfChanged =
      useRequestGeoLocationPermissionAndUpdateAppStoreIfChanged();

    const appDispatch = useAppDispatch();

    const openNativeSettings = useCallback(() => {
      NativeSettings.open({
        optionAndroid: AndroidSettings.ApplicationDetails,
        optionIOS: IOSSettings.App,
      });
    }, []);

    const localNotificationsPermissionIsGranted =
      localNotificationsPermissionState === "granted";
    const motionPermissionIsGranted = motionPermissionState === "granted";
    const locationAlwaysPermissionIsGranted =
      locationAlwaysPermissionState.always;

    const localNotificationsPermissionIsPrompt =
      localNotificationsPermissionState === "prompt";
    const motionPermissionIsPrompt = motionPermissionState === "prompt";
    const locationPermissionIsPrompt =
      locationAlwaysPermissionState.type === "notDetermined";

    const requestPermissions = useCallback(async () => {
      if (localNotificationsPermissionIsPrompt) {
        const newLocationNotificationState =
          await LocalNotifications.requestPermissions();

        if (
          newLocationNotificationState.display !==
          localNotificationsPermissionState
        ) {
          appDispatch({
            localNotificationsPermissionState:
              newLocationNotificationState.display,
            type: "localNotificationsPermissionStateChanged",
          });
        }
      }

      if (motionPermissionIsPrompt) {
        const newMotionPermissionState =
          await GershadCheckPermissionsPlugin.requestMotionPermission();

        if (
          newMotionPermissionState.permissionState !== motionPermissionState
        ) {
          appDispatch({
            motionPermissionState: newMotionPermissionState.permissionState,
            type: "motionPermissionStateChanged",
          });
        }
      }

      if (locationPermissionIsPrompt) {
        const newLocationPermissionState =
          await requestGeoLocationPermissionAndUpdateAppStoreIfChanged();

        if (
          JSON.stringify(newLocationPermissionState) !==
          JSON.stringify(locationAlwaysPermissionState)
        ) {
          appDispatch({
            backgroundGeolocationProviderState: newLocationPermissionState,
            type: "backgroundGeolocationProviderStateChanged",
          });
        }
      }
    }, [
      appDispatch,
      localNotificationsPermissionIsPrompt,
      localNotificationsPermissionState,
      locationAlwaysPermissionState,
      locationPermissionIsPrompt,
      motionPermissionIsPrompt,
      motionPermissionState,
      requestGeoLocationPermissionAndUpdateAppStoreIfChanged,
    ]);

    if (
      localNotificationsPermissionIsGranted &&
      motionPermissionIsGranted &&
      locationAlwaysPermissionIsGranted
    ) {
      console.warn(
        "[NotificationsPrerequisitesNotice] Unnecessarily rendered — should conditionally render in parent!",
      );

      return;
    }

    return (
      <>
        <Typography variant="body1">
          The following permissions must be granted to enable background
          location sharing:
        </Typography>
        <List>
          <NotificationsPrerequisitesNoticeListItem
            isEnabled={locationAlwaysPermissionIsGranted}
            text={
              platform === "ios"
                ? strings.NotificationsPrerequisitesNotice.ios
                    .locationAlwaysPermissionLabel
                : strings.NotificationsPrerequisitesNotice.android
                    .locationAlwaysPermissionLabel
            }
          />
          <NotificationsPrerequisitesNoticeListItem
            isEnabled={motionPermissionIsGranted}
            text={
              platform === "ios"
                ? strings.NotificationsPrerequisitesNotice.ios
                    .motionAndFitnessPermissionLabel
                : strings.NotificationsPrerequisitesNotice.android
                    .physicalActivityPermissionLabel
            }
          />
          <NotificationsPrerequisitesNoticeListItem
            isEnabled={localNotificationsPermissionIsGranted}
            text={
              platform === "ios"
                ? strings.NotificationsPrerequisitesNotice.ios
                    .notificationsPermissionLabel
                : strings.NotificationsPrerequisitesNotice.android
                    .notificationsPermissionLabel
            }
          />
        </List>

        {localNotificationsPermissionIsPrompt ||
        motionPermissionIsPrompt ||
        locationPermissionIsPrompt ? (
          <Button onClick={requestPermissions}>
            <ListItemText>Request Permission</ListItemText>
          </Button>
        ) : (
          <Button onClick={openNativeSettings}>
            <ListItemText>Open app settings</ListItemText>
          </Button>
        )}
      </>
    );
  },
);

NotificationsPrerequisitesNotice.displayName =
  "NotificationsPrerequisitesNotice";

export default NotificationsPrerequisitesNotice;
