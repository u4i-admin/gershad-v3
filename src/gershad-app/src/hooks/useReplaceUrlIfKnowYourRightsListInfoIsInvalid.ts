import { useRouter } from "next/router";

import { KnowYourRightsListInfo } from "src/pageComponents/Faqs/FaqsPage";
import { useAppKnowYourRightsPageContent } from "src/stores/appStore";

/**
 * If there’s no `contentBlock` and `listItemInfos` is empty forcibly navigate
 * back to provided URL (this should only happen if there’s a bug in the
 * app/backend or a piece of content is removed after
 * useLoadKnowYourRightPageContent runs)
 */
const useReplaceUrlIfKnowYourRightsListInfoIsInvalid = ({
  listInfo,
  url,
}: {
  listInfo: KnowYourRightsListInfo | null | undefined;
  url: string;
}) => {
  const router = useRouter();

  const pageContent = useAppKnowYourRightsPageContent();

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

export default useReplaceUrlIfKnowYourRightsListInfoIsInvalid;
