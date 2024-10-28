import { registerPlugin } from "@capacitor/core";

type GershadAppIsUpdateAvailableParams = {
  bucketName: string;
  cognitoPoolId: string;
  versionFileName: string;
};

type GershadAppUpdateSelfParams = {
  bucketName: string;
  cognitoPoolId: string;
  gershadAppFileName: string;
};

type GershadAppUpdateDeletePlugin = {
  selfDelete(): Promise<{ isFailed: boolean }>;

  isUpdateAvailable(
    gershadAppIsUpdateAvailableParams: GershadAppIsUpdateAvailableParams,
  ): Promise<{ isUpdateNeeded: boolean }>;

  updateSelf(
    gershadAppUpdateSelfParams: GershadAppUpdateSelfParams,
  ): Promise<{ isFailed: boolean }>;
};

const androidGershadAppUpdateDeletePlugin: GershadAppUpdateDeletePlugin =
  registerPlugin<GershadAppUpdateDeletePlugin>("GershadAppUpdateDeletePlugin");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGershadAppUpdateDeletePlugin: GershadAppUpdateDeletePlugin = {
  isUpdateAvailable: async () => ({
    isUpdateNeeded: true,
  }),
  selfDelete: async () => ({
    isFailed: false,
  }),
  updateSelf: async () => ({
    isFailed: true,
  }),
};

const GershadAppUpdateDeletePlugin =
  /*import.meta.env.VITE_BUILD_TYPE === "mock"
    ? mockGershadAppUpdateDeletePlugin
    : */ androidGershadAppUpdateDeletePlugin;

export default GershadAppUpdateDeletePlugin;
