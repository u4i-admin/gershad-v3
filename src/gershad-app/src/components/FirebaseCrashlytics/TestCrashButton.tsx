import { FirebaseCrashlytics } from "@capacitor-firebase/crashlytics";
import Button from "@mui/material/Button";
import { FC, memo, useCallback } from "react";

/**
 * Button that triggers a native app crash
 *
 * @remarks
 * Add to a page to test FirebaseCrashlytics crash reporting.
 *
 * Note that crashes will only be sent successfully in signed release builds!
 */
const TestCrashButton: FC = memo(() => {
  const onClick = useCallback(async () => {
    try {
      await FirebaseCrashlytics.crash({ message: "Test crashlytics" });
    } catch (error) {
      console.error("Failed to trigger crash:", error);
    }
  }, []);

  return (
    <Button onClick={onClick} variant="contained">
      {"Test Crash"}
    </Button>
  );
});

TestCrashButton.displayName = "TestCrashButton";

export default TestCrashButton;
