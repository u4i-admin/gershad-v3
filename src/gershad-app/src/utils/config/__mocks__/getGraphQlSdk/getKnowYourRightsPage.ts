import { GqlGetKnowYourRightsPage } from "src/generated/graphQl";
import knowYourRightsPageTestData from "src/test/data/knowYourRightsPageTestData";

const getKnowYourRightsPage = (): Promise<GqlGetKnowYourRightsPage> => {
  if (global?.graphQlSdkOverrides?.getKnowYourRightsPageResponse) {
    return Promise.resolve(
      global.graphQlSdkOverrides.getKnowYourRightsPageResponse,
    );
  }

  return Promise.resolve({
    knowYourRightsPage: knowYourRightsPageTestData,
  });
};

export default getKnowYourRightsPage;
