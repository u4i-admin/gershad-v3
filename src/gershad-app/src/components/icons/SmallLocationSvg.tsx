import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

import colors from "src/values/colors";

const SmallLocationSvg: StylableFC = memo((props) => (
  <svg fill="none" viewBox="0 0 19 19" {...props}>
    <path
      d="M9.5 17a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
      fill={colors.yellow}
    />
    <path
      d="M12.176 8.052a2.74 2.74 0 0 0-.841-1.875 2.757 2.757 0 0 0-1.911-.768 2.756 2.756 0 0 0-1.881.839 2.74 2.74 0 0 0-.77 1.905v.051c-.008.45.116.891.357 1.27l.05.102 2.396 4.015 2.294-4.066.051-.101c.208-.391.314-.828.306-1.27 0-.052-.051-.052-.051-.102Zm-1.631.66-.051.051a1.221 1.221 0 0 1-1.02.61 1.402 1.402 0 0 1-1.07-.56v-.05a1.156 1.156 0 0 1-.153-.559v-.05a1.269 1.269 0 0 1 1.223-1.22 1.2 1.2 0 0 1 1.123.713c.063.144.098.299.1.455v.051c.005.197-.048.391-.152.56Z"
      fill={colors.black}
    />
  </svg>
));

SmallLocationSvg.displayName = "SmallLocationSvg";

export default SmallLocationSvg;
