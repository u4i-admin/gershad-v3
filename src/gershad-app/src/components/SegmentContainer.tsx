import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Container, { ContainerProps } from "@mui/material/Container";
import { memo, ReactNode, useMemo } from "react";
import { match } from "ts-pattern";

const containerNarrow = css({
  padding: "0.625rem",
});

const containerNormal = css({
  padding: "1.375rem",
});

const SegmentContainer: StylableFC<
  {
    children: ReactNode;
    padding: "narrow" | "normal";
  } & ContainerProps
> = memo(({ children, padding, ...remainingProps }) => {
  const containerStyles = useMemo(
    () =>
      match(padding)
        .with("narrow", () => containerNarrow)
        .with("normal", () => containerNormal)
        .exhaustive(),
    [padding],
  );

  return (
    <Container css={containerStyles} maxWidth={false} {...remainingProps}>
      {children}
    </Container>
  );
});

SegmentContainer.displayName = "SegmentContainer";

export default SegmentContainer;
