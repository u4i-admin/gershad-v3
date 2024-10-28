import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { Amplify, Auth } from "aws-amplify";

import GershadCognitoPlugin from "src/plugins/GershadCognitoPlugin";
import { capacitorPreferencesKeys } from "src/values/appValues";

/**
 * `localStorage` key `aws-amplify`’s `Auth` module uses to store Cognito
 * identity ID.
 *
 * This is reverse engineered by looking at the written key name. We can’t
 * assume it will always have the same shape in the future, though there’s no
 * reason to think it should change.
 */
const awsAmplifyAuthCognitoIdentityIdLocalStorageKey = `CognitoIdentityId-${process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID}`;

const loadAndStoreCognitoIdentityId = async () => {
  try {
    const localStorageCognitoIdentityId = localStorage.getItem(
      awsAmplifyAuthCognitoIdentityIdLocalStorageKey,
    );

    // If localStorage identity ID is set we should trust it over Capacitor
    // Preferences’s value since the localStorage one is managed by aws-amplify.
    // This is only likely to happen on iOS where localStorage values can be
    // erased after 7 days on inactivity.
    //
    // If localStorage identity ID isn’t set and it is set in Preferences we
    // should pre-populate localStorage so it’s picked up by aws-amplify
    if (localStorageCognitoIdentityId) {
      console.info(
        "[loadAndStoreCognitoIdentityId] Cognito identity ID already stored in localStorage",
      );
    } else {
      const preferencesCognitoIdentityId = (
        await Preferences.get({
          key: capacitorPreferencesKeys.cognitoIdentityId,
        })
      ).value;

      const legacyAndroidCognitoIdentityId =
        preferencesCognitoIdentityId || Capacitor.getPlatform() !== "android"
          ? null
          : (
              await GershadCognitoPlugin.getCognitoId({
                cognitoPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
              })
            ).cognitoId;

      const loadedCognitoIdentityId =
        preferencesCognitoIdentityId ?? legacyAndroidCognitoIdentityId ?? null;

      console.info(
        "[loadAndStoreCognitoIdentityId] Cognito identity ID not stored in localStorage. Loaded values:",
        { legacyAndroidCognitoIdentityId, preferencesCognitoIdentityId },
      );

      if (loadedCognitoIdentityId) {
        console.info(
          `[loadAndStoreCognitoIdentityId] Writing Cognito identity ID ${loadedCognitoIdentityId} to AWS Amplify localStorage`,
        );
        localStorage.setItem(
          awsAmplifyAuthCognitoIdentityIdLocalStorageKey,
          loadedCognitoIdentityId,
        );
      }
    }

    // TODO: Move to init function once we move this app to Vite
    Amplify.configure({
      aws_cognito_identity_pool_id:
        process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
      aws_cognito_region: process.env.NEXT_PUBLIC_COGNITO_REGION,
    });

    const user = await Auth.currentCredentials();

    const awsAmplifyCognitoIdentityId = user.identityId;

    // Persist key in Capacitor Preferences to be read in future
    // getCognitoIdentityId calls
    await Preferences.set({
      key: capacitorPreferencesKeys.cognitoIdentityId,
      value: awsAmplifyCognitoIdentityId,
    });

    return user.identityId;
  } catch (error) {
    console.error(
      "[loadAndStoreCognitoIdentityId] Error while getting Cognito Identity ID:",
      error,
    );

    return null;
  }
};

export default loadAndStoreCognitoIdentityId;
