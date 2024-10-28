import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

import colors from "src/values/colors";

const StopCheckSvg: StylableFC = memo((props) => (
  <svg fill="none" viewBox="0 0 83 83" {...props}>
    <g filter="url(#a)">
      <circle cx="41.5" cy="39.5" r="37.5" fill={colors.yellow} />
      <path
        d="M32.627 60.086 20.49 47.95V30.627L32.627 18.49h17.322l12.137 12.136V47.95L49.95 60.086H32.627Z"
        fill="#F42525"
        stroke={colors.black}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <path
        d="M57.975 32.486h-2.153v9.884h2.153v-9.884ZM33.507 36.107H28.81v2.153h4.698v-2.153ZM52.984 43.937h-4.698v2.153h4.698v-2.153Z"
        fill={colors.white}
      />
      <path
        d="M51.712 40.316h-1.763V38.26h-2.153v2.056h-1.86V38.26h-2.152v2.056h-1.86V38.26H39.77v2.056h-1.86v-3.133h-2.25v3.133h-8.907v-3.133h-2.25v4.306a1.086 1.086 0 0 0 1.076 1.078h27.208a1.086 1.086 0 0 0 1.077-1.078v-4.208H51.71v3.034Z"
        fill={colors.white}
      />
    </g>
    <defs>
      <filter
        id="a"
        x="0"
        y="0"
        width="83"
        height="83"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.161 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1541_2043"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_1541_2043"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
));

StopCheckSvg.displayName = "StopCheckSvg";

export default StopCheckSvg;
