import { isMatching, P } from "ts-pattern";

export const notificationChannelTypeIds = {
  hotZoneEntered: "hotZoneEntered",
  newReportsNearDevice: "newReportsNearDevice",
  newReportsNearPoi: "newReportsNearPoi",
};

const gershadNotificationDataPattern = P.union(
  {
    latLng: {
      lat: P.number,
      lng: P.number,
    },
    type: "newReportsNearDevice",
  },
  {
    latLng: {
      lat: P.number,
      lng: P.number,
    },
    type: "newReportsNearPoi",
  },
  {
    // It would be better to use hotZonePk, but it makes the logic more
    // complicated
    // hotZonePk: P.number,
    latLng: {
      lat: P.number,
      lng: P.number,
    },
    type: "hotZoneEntered",
  },
);

export type GershadNotificationData = P.infer<
  typeof gershadNotificationDataPattern
>;

export const isGershadNotificationData = isMatching(
  gershadNotificationDataPattern,
);
