import { replaceArabicNumeralsWithPersianNumerals } from "@asl-19/js-utils";
import { StylableFC } from "@asl-19/react-dom-utils";
import { MarkerClusterer } from "@react-google-maps/api";
import { Cluster } from "@react-google-maps/marker-clusterer";
import {
  ClustererOptions,
  ClusterIconStyle,
  MarkerExtended,
} from "@react-google-maps/marker-clusterer";
import { memo, useCallback, useMemo } from "react";

import ReportMarker, {
  ReportMarkerReportCountAttribute,
} from "src/components/HomePage/GoogleMap/ReportMarker";
import { GqlReportGroup } from "src/generated/graphQl";
import { useAppLocaleInfo } from "src/stores/appStore";
import { useMapGoogleMapRef } from "src/stores/mapStore";

const ReportClusterListItem: StylableFC<{
  onOpenUserReportGroupDialogClick: ({
    userReportGroup,
  }: {
    userReportGroup: GqlReportGroup;
  }) => void;
  userReportGroups: Array<GqlReportGroup>;
}> = memo(({ onOpenUserReportGroupDialogClick, userReportGroups }) => {
  const mapRef = useMapGoogleMapRef();
  const { localeCode } = useAppLocaleInfo();
  const clusterStyles: Array<ClusterIconStyle> = useMemo(
    () =>
      [1, 2, 3].map((item) => ({
        height: 50,
        textSize: 24,
        url: `/images/cluster${item}.png`,
        width: 50,
      })),
    [],
  );
  const options: ClustererOptions = useMemo(
    () => ({
      averageCenter: true,
      enableRetinaIcons: true,
      imagePath: `/images/cluster`,
      styles: clusterStyles,
      zoomOnClick: true,
    }),
    [clusterStyles],
  );

  const calculator = useCallback(
    (markers: Array<MarkerExtended & ReportMarkerReportCountAttribute>) => {
      const totalReports = markers.reduce(
        (total, curr) =>
          total +
          // Use 1 as fallback if reportCount is missing (should never happen
          // since it’s set in ReportMarker markerOptions)
          (curr?.reportCount ?? 1),
        0,
      );

      const index = totalReports < 5 ? 1 : totalReports < 8 ? 2 : 3;
      return {
        index,
        text:
          localeCode === "fa"
            ? replaceArabicNumeralsWithPersianNumerals(`${totalReports}`)
            : `${totalReports}`,
      };
    },
    [localeCode],
  );

  // Workaround for Google Maps cluster location bug
  //
  // Currently disabled since this might not be necessary anymore after we
  // changed the report fetching behavior (which was causing report group
  // instability issues which might have been the underlying cause)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClusterClick = useCallback(
    (cluster: Cluster) => {
      const clusterCenter = cluster.getCenter();

      if (!mapRef.current || !clusterCenter) return;

      const center: google.maps.LatLngLiteral = {
        lat: clusterCenter.lat(),
        lng: clusterCenter.lng(),
      };

      const mapBounds = new google.maps.LatLngBounds(center, center);

      const markers = cluster.getMarkers();

      markers.forEach((marker) => {
        const position = marker.getPosition();

        if (position) {
          mapBounds.extend(position);
        }
      });

      mapRef.current.setTilt(0);
      mapRef.current.setHeading(0);
      mapRef.current.fitBounds(mapBounds);
      mapRef.current.panTo(center);
    },

    [mapRef],
  );

  return (
    <MarkerClusterer
      options={options}
      calculator={calculator}
      // onClick={onClusterClick}
    >
      {(clusterer) => (
        <>
          {userReportGroups.map((userReportGroup, index) => (
            <ReportMarker
              clusterer={clusterer}
              userReportGroup={userReportGroup}
              key={index}
              onOpenUserReportGroupDialogClick={
                onOpenUserReportGroupDialogClick
              }
            />
          ))}
        </>
      )}
    </MarkerClusterer>
  );
});

ReportClusterListItem.displayName = "ReportClusterListItem";

export default ReportClusterListItem;
