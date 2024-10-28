import { GqlGetUserGuidePage } from "src/generated/graphQl";
import userGuidePageTestData from "src/test/data/userGuidePageTestData";

const getUserGuidePage = (): Promise<GqlGetUserGuidePage> => {
  if (global?.graphQlSdkOverrides?.getUserGuidePageResponse) {
    return Promise.resolve(global.graphQlSdkOverrides.getUserGuidePageResponse);
  }

  return Promise.resolve({
    userGuidePage: userGuidePageTestData,
  });
};

export default getUserGuidePage;
