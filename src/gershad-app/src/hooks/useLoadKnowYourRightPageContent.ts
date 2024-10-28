import { useEffect } from "react";

import {
  useAppDispatch,
  useAppKnowYourRightsPageContent,
  useAppStrings,
} from "src/stores/appStore";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";
import {
  logKyrDataLoadFail,
  logKyrDataLoadSuccess,
} from "src/utils/firebaseAnalytics";

const useLoadKnowYourRightPageContent = () => {
  const strings = useAppStrings();

  const appDispatch = useAppDispatch();
  const pageContent = useAppKnowYourRightsPageContent();

  useEffect(() => {
    if (pageContent) {
      return;
    }

    const abortController = new AbortController();

    const getPageContent = async () => {
      try {
        const graphQlSdk = await getGraphQlSdk();

        const knowYourRightsPageResponse =
          await graphQlSdk.getKnowYourRightsPage();

        const knowYourRightsPage =
          knowYourRightsPageResponse.knowYourRightsPage;

        if (!knowYourRightsPage) {
          console.warn(
            "[useKnowYourRightPageContent] getKnowYourRightsPage returned null — is there no KnowYourRightsPageNode in this environment?",
          );

          appDispatch({
            knowYourRightsPage: null,
            type: "knowYourRightsPageLoaded",
          });

          appDispatch({
            messageStringKey: "shared.toasts.dataLoadFailed",
            messageType: "error",
            type: "snackbarQueued",
          });

          logKyrDataLoadFail();

          return;
        }

        appDispatch({
          knowYourRightsPage,
          type: "knowYourRightsPageLoaded",
        });

        logKyrDataLoadSuccess();
      } catch (error) {
        console.error(
          "[useLoadKnowYourRightPageContent] Error in getPageContent:",
          error,
        );

        appDispatch({
          messageStringKey: "shared.toasts.dataLoadFailed",
          messageType: "error",
          type: "snackbarQueued",
        });
      }
    };

    if (!pageContent) {
      getPageContent();
    }

    return () => {
      abortController.abort();
    };
  }, [appDispatch, pageContent, strings]);

  return pageContent;
};

export default useLoadKnowYourRightPageContent;
