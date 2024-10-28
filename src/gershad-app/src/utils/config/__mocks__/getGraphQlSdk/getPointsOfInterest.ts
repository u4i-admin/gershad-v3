import { getSdk } from "src/generated/graphQl";
import pointsOfInterestTestDataById from "src/test/data/pointsOfInterestTestDataById";

const getPointsOfInterest: ReturnType<
  typeof getSdk
>["getPointsOfInterest"] = () => {
  if (global?.graphQlSdkOverrides?.getPointsOfInterestResponse) {
    return Promise.resolve(
      global.graphQlSdkOverrides.getPointsOfInterestResponse,
    );
  }
  const pointsOfInterest = Object.values(pointsOfInterestTestDataById);

  return Promise.resolve({
    pointsOfInterest,
  });
};

export default getPointsOfInterest;
