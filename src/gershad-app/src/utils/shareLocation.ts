import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";

const shareLocation = async ({
  location,
}: {
  location: google.maps.LatLngLiteral;
}) => {
  const locationLink = `https://gershad.com/${location.lat},${location.lng}`;

  if (Capacitor.isNativePlatform()) {
    try {
      await Share.share({
        url: locationLink,
      });
    } catch {
      console.warn("cannot share");
    }
  } else {
    try {
      await navigator.clipboard.writeText(locationLink);
      console.warn("copied");
    } catch {
      console.warn("cannot copy link");
    }
  }
};

export default shareLocation;
