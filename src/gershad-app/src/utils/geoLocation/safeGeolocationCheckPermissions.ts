import { Geolocation, PermissionStatus } from "@capacitor/geolocation";

const safeGeolocationCheckPermissions = async (): Promise<PermissionStatus> => {
  try {
    const permissionStatus = await Geolocation.checkPermissions();

    return permissionStatus;
  } catch (error) {
    console.error(
      "[safeGeolocationCheckPermissions]: Failed to check Geolocation permissions, assuming denied:",
      error,
    );
    return {
      coarseLocation: "denied",
      location: "denied",
    };
  }
};

export default safeGeolocationCheckPermissions;
