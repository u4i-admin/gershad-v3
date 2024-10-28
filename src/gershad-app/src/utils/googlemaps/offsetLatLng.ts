import { LatLng } from "src/stores/appStore";

let latLngOffset: LatLng | null | undefined = undefined;

const offsetLatLng = (latLng: LatLng): LatLng => {
  if (!process.env.NEXT_PUBLIC_DEV_OFFSET_LATLNG) {
    console.warn(
      "[offsetLatLng] Skipping offset because NEXT_PUBLIC_DEV_OFFSET_LATLNG not set!",
    );

    return latLng;
  }

  const envOffsetLat = parseFloat(
    process.env.NEXT_PUBLIC_DEV_OFFSET_LATLNG.split(",")[0],
  );
  const envOffsetLng = parseFloat(
    process.env.NEXT_PUBLIC_DEV_OFFSET_LATLNG.split(",")[1],
  );

  if (latLngOffset === undefined) {
    latLngOffset = process.env.NEXT_PUBLIC_DEV_OFFSET_LATLNG
      ? {
          lat: envOffsetLat,
          lng: envOffsetLng,
        }
      : null;
  }

  return {
    lat: latLng.lat + (latLngOffset?.lat ?? 0),
    lng: latLng.lng + (latLngOffset?.lng ?? 0),
  };
};

export default offsetLatLng;
