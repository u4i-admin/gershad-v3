import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const ExclamationSvg: StylableFC<{
  backgroundColor: string;
  foregroundColor: string;
}> = memo(({ backgroundColor, foregroundColor, ...remainingProps }) => (
  <svg stroke="none" viewBox="0 0 32 32" {...remainingProps}>
    <path
      d="M16 30c7.732 0 14-6.268 14-14S23.732 2 16 2 2 8.268 2 16s6.268 14 14 14Z"
      fill={backgroundColor}
    />
    <path
      d="M17.48 20.834c0 .956-.765 1.74-1.74 1.74S14 21.79 14 20.834s.765-1.74 1.74-1.74 1.74.784 1.74 1.74Zm-.943-3.48h-1.613a.447.447 0 0 1-.447-.426l-.34-7.46A.447.447 0 0 1 14.582 9h2.312c.256 0 .46.214.447.469l-.358 7.46a.447.447 0 0 1-.447.426Z"
      fill={foregroundColor}
    />
  </svg>
));

ExclamationSvg.displayName = "ExclamationSvg";

export default ExclamationSvg;
