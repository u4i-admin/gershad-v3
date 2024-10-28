import { useEffect } from "react";

import {
  useAppDispatch,
  useAppFaqsPageContent,
  useAppStrings,
} from "src/stores/appStore";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";

const useLoadFaqsPageContent = () => {
  const strings = useAppStrings();

  const appDispatch = useAppDispatch();
  const pageContent = useAppFaqsPageContent();

  useEffect(() => {
    if (pageContent) {
      return;
    }

    const abortController = new AbortController();

    const getPageContent = async () => {
      try {
        const graphQlSdk = await getGraphQlSdk();

        const faqsPageResponse = await graphQlSdk.getFaqsPage();

        const faqsPage = faqsPageResponse.knowYourRightsPage;

        if (!faqsPage) {
          console.warn(
            "[useLoadFaqsPageContent] getFaqsPage returned null — is there no FaqsPageNode in this environment?",
          );

          appDispatch({
            faqsPage: null,
            type: "faqsPageLoaded",
          });

          appDispatch({
            messageStringKey: "shared.toasts.dataLoadFailed",
            messageType: "error",
            type: "snackbarQueued",
          });

          return;
        }

        appDispatch({
          faqsPage,
          type: "faqsPageLoaded",
        });
      } catch (error) {
        console.error(
          "[useLoadFaqsPageContent] Error in getPageContent:",
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

export default useLoadFaqsPageContent;
