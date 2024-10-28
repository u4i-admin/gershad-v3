export const increaseMapBounds = (
  multiplier: number,
  currentMapBounds: google.maps.LatLngBoundsLiteral,
): google.maps.LatLngBoundsLiteral => {
  const mapBounds = new google.maps.LatLngBounds(currentMapBounds);
  // Get the northeast and southwest corners of the current bounds
  const ne = mapBounds.getNorthEast();
  const sw = mapBounds.getSouthWest();

  // Calculate the center of the current bounds
  const center = mapBounds.getCenter();

  // Calculate the current span of the bounds
  const latSpan = ne.lat() - sw.lat();
  const lngSpan = ne.lng() - sw.lng();

  // Increase the spans by multiplier
  const newLatSpan = latSpan * multiplier;
  const newLngSpan = lngSpan * multiplier;

  // Calculate the new bounds
  const newNe = new google.maps.LatLng(
    center.lat() + newLatSpan / 2,
    center.lng() + newLngSpan / 2,
  );
  const newSw = new google.maps.LatLng(
    center.lat() - newLatSpan / 2,
    center.lng() - newLngSpan / 2,
  );
  const newBounds = new google.maps.LatLngBounds(newSw, newNe).toJSON();

  return newBounds;
};
