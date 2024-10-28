import { StylableFC } from "@asl-19/react-dom-utils";
import Container from "@mui/material/Container";
import { ComponentProps, memo, ReactNode } from "react";

const PageContainer: StylableFC<{
  children: ReactNode;
  disableGutters?: boolean;
  maxWidth?: ComponentProps<typeof Container>["maxWidth"];
}> = memo(
  ({ children, disableGutters, maxWidth = "sm", ...remainingProps }) => (
    <Container
      component="main"
      disableGutters={disableGutters}
      maxWidth={maxWidth}
      {...remainingProps}
    >
      {children}
    </Container>
  ),
);

PageContainer.displayName = "PageContainer";

export default PageContainer;
