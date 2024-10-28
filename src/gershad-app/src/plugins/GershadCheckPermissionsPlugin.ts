import { registerPlugin } from "@capacitor/core";
import { PermissionState } from "@capacitor/core";

type GershadCheckPermissionsPlugin = {
  isBackgroundLocationPermissionGranted(): Promise<{ isGranted: boolean }>;
  /*
    PermissionStates:
     1. granted - permission granted.
     2. denied - permission denied
     3. prompt - permission neither granted nor denied.
     4. prompt-with-rationale - Currently for Android only. If user denied for the first time, this state means that we need to present a UI to the user to explain why they need to grant the permission. In Android if a user denies for 2 times than even if we all requestPermissions, Android OS will not show the dialog.
  */
  getMotionPermissionState(): Promise<{ permissionState: PermissionState }>;
  requestMotionPermission(): Promise<{ permissionState: PermissionState }>;
};

const androidGershadCheckPermissionsPlugin: GershadCheckPermissionsPlugin =
  registerPlugin<GershadCheckPermissionsPlugin>(
    "GershadCheckPermissionsPlugin",
  );
/*
const mockGershadCheckPermissionsPlugin: GershadCheckPermissionsPlugin = {
  getMotionPermissionState: async () => ({
    permissionState: PermissionState.granted,
  }),
  isBackgroundLocationPermissionGranted: async () => ({
    isGranted: true,
  }),
  requestMotionPermission: async () => ({
    permissionState: PermissionState.granted,
  }),
};*/

const GershadCheckPermissionsPlugin = //Capacitor.isNativePlatform()
  androidGershadCheckPermissionsPlugin;
//: mockGershadCheckPermissionsPlugin;

export default GershadCheckPermissionsPlugin;
