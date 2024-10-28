import { useRouter } from "next/router";

import { KnowYourRightsListInfo } from "src/pageComponents/Faqs/FaqsPage";
import { useAppFaqsPageContent } from "src/stores/appStore";

/**
 * If there’s no `contentBlock` and `listItemInfos` is empty forcibly navigate
 * back to provided URL (this should only happen if there’s a bug in the
 * app/backend or a piece of content is removed after
 * useAppFaqsPageContent runs)
 */
const useReplaceUrlIfFaqsListInfoIsInvalid = ({
  listInfo,
  url,
}: {
  listInfo: KnowYourRightsListInfo | null | undefined;
  url: string;
}) => {
  const router = useRouter();

  const pageContent = useAppFaqsPageContent();

  if (listInfo === null || listInfo === undefined) return;

  if (
    pageContent &&
    listInfo.contentBlock === null &&
    listInfo.listItemInfos === null
  ) {
    console.warn(
      `[useReplaceUrlIfListInfoIsInvalid] Routing to ${url} because provided listInfo is invalid`,
    );
    router.replace(url);
  }
};

export default useReplaceUrlIfFaqsListInfoIsInvalid;
