import { Location } from "@transistorsoft/capacitor-background-geolocation";

const locationToLatLngLiteral = (
  location: Location,
): google.maps.LatLngLiteral => ({
  lat: location.coords.latitude,
  lng: location.coords.longitude,
});

export default locationToLatLngLiteral;
