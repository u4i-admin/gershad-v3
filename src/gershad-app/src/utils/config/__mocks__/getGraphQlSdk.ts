import { SdkWithHasAccessToken } from "src/types/apiTypes";
import getFaqsPage from "src/utils/config/__mocks__/getGraphQlSdk/getFaqsPage";
import getKnowYourRightsPage from "src/utils/config/__mocks__/getGraphQlSdk/getKnowYourRightsPage";
import getPointsOfInterest from "src/utils/config/__mocks__/getGraphQlSdk/getPointsOfInterest";
import getReports from "src/utils/config/__mocks__/getGraphQlSdk/getReports";
import getStaticPage from "src/utils/config/__mocks__/getGraphQlSdk/getStaticPage";
import getUserGuidePage from "src/utils/config/__mocks__/getGraphQlSdk/getUserGuidePage";

const getGraphQlSdk = async (): Promise<Partial<SdkWithHasAccessToken>> => ({
  getFaqsPage,
  getKnowYourRightsPage,
  getPointsOfInterest,
  getReports,
  getStaticPage,
  getUserGuidePage,
});

export default getGraphQlSdk;
