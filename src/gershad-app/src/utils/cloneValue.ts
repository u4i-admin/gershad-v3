/**
 * Clone a given value using `structuredClone(value)`, falling back to
 * `JSON.parse(JSON.stringify(value))` if the browser doesn’t support
 * `structuredClone`.
 */
const cloneValue = <Value>(value: Value): Value => {
  const structuredCloneSupported = "structuredClone" in window;

  // Verify that fallback method works in development (so we don’t miss fallback
  // errors that will only happen on older devices)
  if (structuredCloneSupported && process.env.NODE_ENV === "development") {
    try {
      JSON.parse(JSON.stringify(value));
    } catch (error) {
      console.warn(
        "[cloneValue] Error in JSON.parse(JSON.stringify(value)) fallback (this will cause the function to throw an exception in older device web views):",
        error,
      );
    }
  }

  return structuredCloneSupported
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
};

export default cloneValue;
