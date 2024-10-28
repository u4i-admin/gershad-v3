import useOverflowState from "@asl-19/use-overflow-state";
import { css, SerializedStyles } from "@emotion/react";
import { Theme, useTheme } from "@mui/material/styles";
import { cloneElement, FC, memo, ReactElement, useMemo, useRef } from "react";
import { match } from "ts-pattern";

import { useAppLocaleInfo } from "src/stores/appStore";
import {
  overflowIndicatorContainer,
  overflowIndicatorContainerLeftActive,
  overflowIndicatorContainerRightActive,
} from "src/styles/overflowIndicatorStyles";

const container = ({ theme }: { theme: Theme }) =>
  css(
    overflowIndicatorContainer({ theme }),
    {
      "> *:only-child": {
        WebkitOverflowScrolling: "touch",
      },
    },
    {
      "&.overflowIndicatorLeft": overflowIndicatorContainerLeftActive,
      "&.overflowIndicatorRight": overflowIndicatorContainerRightActive,
    },
  );

const OverflowIndicatorWrapper: FC<{
  children: ReactElement;
  className?: string;
  containerCss?: SerializedStyles;
}> = memo(({ children, className, containerCss }) => {
  const { localeCode } = useAppLocaleInfo();

  const scrollableElementRef = useRef<HTMLElement>(null);
  const wrapperElementRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();

  const { leftHasOverflow, rightHasOverflow } = useOverflowState({
    scrollableElementRef,
    wrapperElementRef,
  });

  const overflowIndicatorClassNameSegment = match({
    leftHasOverflow,
    localeCode,
    rightHasOverflow,
  })
    /* eslint-disable sort-keys-fix/sort-keys-fix */
    .with(
      { localeCode: "en", leftHasOverflow: true },
      { localeCode: "fa", rightHasOverflow: true }, // Account for stylisPluginRtl
      () => "overflowIndicatorLeft",
    )
    .with(
      { localeCode: "en", rightHasOverflow: true },
      { localeCode: "fa", leftHasOverflow: true }, // Account for stylisPluginRtl
      () => "overflowIndicatorRight",
    )
    /* eslint-enable sort-keys-fix/sort-keys-fix */
    .with({ leftHasOverflow: false, rightHasOverflow: false }, () => null)
    .exhaustive();

  const containerClassName = `${className ? `${className} ` : ""}${
    overflowIndicatorClassNameSegment ? overflowIndicatorClassNameSegment : ""
  }`.trim();

  const containerCssCombined = useMemo(
    () => [container({ theme }), containerCss],
    [containerCss, theme],
  );

  return (
    <div
      className={containerClassName}
      css={containerCssCombined}
      ref={wrapperElementRef}
    >
      {cloneElement(children, { ref: scrollableElementRef })}
    </div>
  );
});

OverflowIndicatorWrapper.displayName = "OverflowIndicatorWrapper";

export default OverflowIndicatorWrapper;
