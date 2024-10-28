import { asType } from "@asl-19/js-utils";

import { GqlReportGroup } from "src/generated/graphQl";

const userReportTestDataBySlug = {
  // cSpell:disable
  reportGroup1: asType<GqlReportGroup>({
    centroidLatitude: 32.1,
    centroidLongitude: 54.3,
    faded: 1,
    firstCreated: "2024-04-10 15:49:52.861266+00:00",
    highestPk: 12886,
    lastUpdate: "2024-04-10 15:49:52.861266+00:00",
    permanent: false,
    reportCount: 1,
    reports: [
      {
        address: "4832+RP Hoseynābād, Yazd Province, Iran",
        client: "WEB",
        created: "2024-04-10T15:27:17.395642+00:00",
        description: "test report description",
        id: "report1",
        location: { x: 54.301785197400676, y: 32.104624753212725 },
        modified: "2024-04-10T15:49:52.861266+00:00",
        permanent: false,
        pk: 12886,
        reporter: {
          id: "UmVwb3J0ZXJOb2RlOjEyMA==",
        },
        requested: "2024-04-10T15:27:17.395031+00:00",
        token: "",
        type: {
          description: "Stop",
          id: "UmVwb3J0VHlwZU5vZGU6Mg==",
          name: "STOP",
        },
        verified: false,
      },
      {
        address: "4832+RP Hoseynābād, Yazd Province, Iran",
        client: "WEB",
        created: "2024-04-10T15:27:17.395642+00:00",
        description: "test report description",
        id: "report3",
        location: { x: 54.301785197400676, y: 32.104624753212725 },
        modified: "2024-04-10T15:49:52.861266+00:00",
        permanent: false,
        pk: 12887,
        reporter: {
          id: "UmVwb3J0ZXJOb2RlOjEyMA==",
        },
        requested: "2024-04-10T15:27:17.395031+00:00",
        token: "",
        type: {
          description: "Stop",
          id: "UmVwb3J0VHlwZU5vZGU6Mg==",
          name: "STOP",
        },
        verified: false,
      },
    ],
    score: 1,
    verified: false,
  }),

  reportGroup2: asType<GqlReportGroup>({
    centroidLatitude: 32.12,
    centroidLongitude: 54.3,
    faded: 1,
    firstCreated: "2024-04-10 15:49:52.861266+00:00",
    highestPk: 12886,
    lastUpdate: "2024-04-10 15:49:52.861266+00:00",
    permanent: false,
    reportCount: 1,
    reports: [
      {
        address: "4832+RP Hoseynābād, Yazd Province, Iran",
        client: "WEB",
        created: "2024-04-10T15:27:17.395642+00:00",
        description: "test report description",
        id: "report1",
        location: { x: 54.301785197400676, y: 32.104624753212725 },
        modified: "2024-04-10T15:49:52.861266+00:00",
        permanent: false,
        pk: 12886,
        reporter: {
          id: "UmVwb3J0ZXJOb2RlOjEyMA==",
        },
        requested: "2024-04-10T15:27:17.395031+00:00",
        token: "",
        type: {
          description: "Stop",
          id: "UmVwb3J0VHlwZU5vZGU6Mg==",
          name: "STOP",
        },
        verified: false,
      },
    ],
    score: 1,
    verified: false,
  }),

  // cSpell:enable
};

export default userReportTestDataBySlug;
