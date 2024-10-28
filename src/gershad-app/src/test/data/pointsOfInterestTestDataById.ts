import { asType } from "@asl-19/js-utils";

import { GqlPointOfInterest } from "src/generated/graphQl";

const pointsOfInterestTestDataById = {
  location1: asType<GqlPointOfInterest>({
    address: "566P+FP Hajjiabad, Saduq, Yazd Province, Iran",
    arn: "",
    created: "2024-04-10T14:37:31.792606+00:00",
    id: "question1=",
    location: { x: 54.23686421178413, y: 32.161211676870344 },
    pk: 203,
    requested: "2024-04-10T14:37:31.779134+00:00",
    token: "",
  }),
};

export default pointsOfInterestTestDataById;
