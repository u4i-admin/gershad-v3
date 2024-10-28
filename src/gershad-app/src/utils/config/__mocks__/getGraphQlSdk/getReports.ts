import { getSdk } from "src/generated/graphQl";
import userReportTestDataBySlug from "src/test/data/userReportTestDataBySlug";

const getReports: ReturnType<typeof getSdk>["getReports"] = () => {
  if (global?.graphQlSdkOverrides?.getReportsResponse) {
    return Promise.resolve(global.graphQlSdkOverrides.getReportsResponse);
  }
  const reports = Object.values(userReportTestDataBySlug);

  return Promise.resolve({
    reports,
  });
};

export default getReports;
