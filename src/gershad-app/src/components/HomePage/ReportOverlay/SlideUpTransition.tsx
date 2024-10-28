import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, memo, ReactElement, Ref } from "react";

const SlideUpTransition = memo(
  forwardRef(function Transition(
    props: TransitionProps & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children: ReactElement<any, any>;
    },
    ref: Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  }),
);

SlideUpTransition.displayName = "SlideUpTransition";

export default SlideUpTransition;
