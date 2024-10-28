import { GqlGetFaqsPage } from "src/generated/graphQl";
import faqsPageTestData from "src/test/data/faqsPageTestData";

const getFaqsPage = (): Promise<GqlGetFaqsPage> => {
  if (global?.graphQlSdkOverrides?.getFaqsPageResponse) {
    return Promise.resolve(global.graphQlSdkOverrides.getFaqsPageResponse);
  }

  return Promise.resolve({
    knowYourRightsPage: faqsPageTestData,
  });
};

export default getFaqsPage;
