import { useEffect } from "react";

import { useAppConnectionStatus, useAppDispatch } from "src/stores/appStore";

const useQueueNoInternetConnectionSnackbarIfNotConnected = () => {
  const appDispatch = useAppDispatch();
  const connectionStatus = useAppConnectionStatus();

  useEffect(() => {
    if (!connectionStatus.connected) {
      appDispatch({
        messageStringKey: "GoogleMap.noInternetConnection",
        messageType: "error",
        type: "snackbarQueued",
      });
    }
  }, [appDispatch, connectionStatus]);
};

export default useQueueNoInternetConnectionSnackbarIfNotConnected;
