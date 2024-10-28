import { ProviderChangeEvent } from "@transistorsoft/capacitor-background-geolocation";
import { match, P } from "ts-pattern";

export type BackgroundGeolocationProviderState =
  | { always?: never; precise?: never; type: "denied" }
  | { always?: never; precise?: never; type: "disabled" }
  | { always?: never; precise?: never; type: "notDetermined" }
  | { always: boolean; precise: boolean; type: "granted" };

const backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState =
  (
    backgroundGeolocationProviderState: ProviderChangeEvent,
  ): BackgroundGeolocationProviderState =>
    match<ProviderChangeEvent>(backgroundGeolocationProviderState)
      .returnType<BackgroundGeolocationProviderState>()
      .with(
        {
          status: 0, // AUTHORIZATION_STATUS_NOT_DETERMINED
        },
        () => ({ type: "notDetermined" }),
      )
      .with(
        {
          enabled: false,
        },
        () => ({ type: "disabled" }),
      )
      .with(
        {
          status: P.union(
            1, // AUTHORIZATION_STATUS_RESTRICTED (iOS-specific policy or global setting?)
            2, // AUTHORIZATION_STATUS_DENIED
          ),
        },
        () => ({ type: "denied" }),
      )
      .with(
        {
          status: P.union(
            3, // AUTHORIZATION_STATUS_ALWAYS
            4, // AUTHORIZATION_STATUS_WHEN_IN_USE
          ),
        },
        (state) => ({
          always: state.status === 3,
          // 0: ACCURACY_AUTHORIZATION_FULL, 1: ACCURACY_AUTHORIZATION_REDUCED
          precise: state.accuracyAuthorization === 0,
          type: "granted",
        }),
      )
      .exhaustive();

export default backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState;
