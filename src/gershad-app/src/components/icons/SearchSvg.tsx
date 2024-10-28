import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const SearchSvg: StylableFC = memo((props) => (
  <svg fill="none" stroke="currentcolor" viewBox="0 0 22 22" {...props}>
    <path
      d="m20.875 20.875-4.673-4.682m2.59-6.256a8.854 8.854 0 1 1-17.709 0 8.854 8.854 0 0 1 17.709 0Z"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
));

SearchSvg.displayName = "SearchSvg";

export default SearchSvg;
