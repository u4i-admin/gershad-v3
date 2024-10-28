import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const LocationSharingSvg: StylableFC = memo((props) => (
  <svg fill="none" viewBox="0 0 24 25" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.8254 7.12718C17.2257 6.9087 17.6856 7.2963 17.5381 7.72782L12.0914 23.6591C11.948 24.0784 11.3704 24.1178 11.1715 23.7218L8.28706 17.9808L2.14051 16.1102C1.71657 15.9811 1.65758 15.4052 2.04656 15.1929L16.8254 7.12718Z"
      fill="currentcolor"
      stroke="currentcolor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.8768 2.43998C10.7688 2.1196 9.60859 2.02059 8.46235 2.1486C7.3161 2.27662 6.20629 2.62915 5.19628 3.18608C4.18627 3.743 3.29585 4.4934 2.57585 5.39444C1.85585 6.29548 1.32038 7.32951 1 8.4375"
      stroke="currentcolor"
      strokeWidth="2"
    />
    <path
      d="M10.8325 6.05527C10.1994 5.87219 9.53638 5.81562 8.88138 5.88877C8.22639 5.96192 7.59221 6.16337 7.01506 6.48161C6.43792 6.79985 5.9291 7.22865 5.51768 7.74353C5.10625 8.25841 4.80026 8.84929 4.61719 9.48242"
      stroke="currentcolor"
      strokeWidth="2"
    />
  </svg>
));

LocationSharingSvg.displayName = "LocationSharingSvg";

export default LocationSharingSvg;
