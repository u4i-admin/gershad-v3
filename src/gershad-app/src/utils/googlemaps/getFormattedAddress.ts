import { match, P } from "ts-pattern";

const getFormattedAddress = async (
  latLng: google.maps.LatLngLiteral | google.maps.LatLng,
) => {
  const geocoder = new google.maps.Geocoder();

  const geocoderResponse = await geocoder.geocode({
    language: "fa",
    location: latLng,
  });

  const formattedAddress = match(geocoderResponse)
    .with(
      { results: P.select(P.array({ formatted_address: P.string })) },
      (results) => results[0].formatted_address,
    )
    .otherwise(() => null);

  if (formattedAddress) {
    return formattedAddress;
  } else {
    console.warn(
      "Couldn’t get formatted address! Geocoder response:",
      geocoderResponse,
    );
  }
  return null;
};

export default getFormattedAddress;
