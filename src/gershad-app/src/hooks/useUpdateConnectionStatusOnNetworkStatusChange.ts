import { Network } from "@capacitor/network";
import { useEffect } from "react";

import {
  useAppConnectionStatus,
  useAppDispatch,
  useAppStrings,
} from "src/stores/appStore";

const useUpdateConnectionStatusOnNetworkStatusChange = () => {
  const dispatch = useAppDispatch();
  const { ErrorMessageDialog: strings } = useAppStrings();

  const connectionStatus = useAppConnectionStatus();

  useEffect(() => {
    Network.addListener("networkStatusChange", (newConnectionStatus) => {
      // networkStatusChange seems to fire redundantly so we use JSON.stringify
      // to avoid dispatching identical newConnectionStatus
      if (
        JSON.stringify(connectionStatus) !== JSON.stringify(newConnectionStatus)
      ) {
        dispatch({
          connectionStatus: newConnectionStatus,
          type: "connectionStatusChanged",
        });
      }
    });

    return () => {
      Network.removeAllListeners();
    };
  }, [connectionStatus, dispatch, strings]);
};

export default useUpdateConnectionStatusOnNetworkStatusChange;
