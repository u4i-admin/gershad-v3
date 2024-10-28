const shouldLog = process.browser;

if (shouldLog) {
  window.asl19StoreStates = window.asl19StoreStates || {};
}

/**
 * Detect if console.log method is overridden by React Strict Mode.
 *
 * This is useful to determine if React has patched the console to suppress
 * double logs (which don’t apply to the groupCollapsed method used here).
 *
 * As of 2024-07-11 this doesn’t work in iOS (due to Capacitor’s console.log
 * patching?) or macOS Safari (since
 * `Function.prototype.toString.call(console.log)` always returns "function
 * log() { [native code] }" -- maybe React’s override behavior is different for
 * Safari?)
 *
 * @see
 * - https://stackoverflow.com/questions/6598945/detect-if-function-is-native-to-browser
 * - https://github.com/reactwg/react-18/discussions/96
 * - https://github.com/facebook/react/issues/21783
 */
const consoleIsOverriddenByReactStrictMode = () =>
  // eslint-disable-next-line no-console
  Function.prototype.toString.call(console.log).includes("StrictMode");

const reducerLog = ({
  action,
  newState,
  state,
  storeName,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  action: { [key: string]: any; type: string };
  newState: any;
  state: any;
  storeName: string;
}) => {
  if (!shouldLog || consoleIsOverriddenByReactStrictMode()) {
    return;
  }

  const actionWithoutType = Object.keys(action).reduce(
    (acc, key) =>
      key === "type"
        ? acc
        : {
            ...acc,
            [key]: action[key],
          },
    {} as { [key: string]: any },
  );

  /* eslint-disable no-console */
  console.groupCollapsed(
    `${storeName}/${action.type}`,
    ...(Object.keys(actionWithoutType).length > 0 ? [actionWithoutType] : []),
  );

  console.log("Action", action);
  console.log("Old state", state);
  console.log("New state", newState);

  console.groupEnd();
  /* eslint-enable no-console */

  window.asl19StoreStates[storeName] = newState;
};

export default reducerLog;
