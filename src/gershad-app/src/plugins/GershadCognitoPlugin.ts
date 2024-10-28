import { registerPlugin } from "@capacitor/core";

type CognitoPoolId = {
  cognitoPoolId: string;
};

type GershadCognitoPlugin = {
  getCognitoId(cognitoPoolId: CognitoPoolId): Promise<{ cognitoId: string }>;
};

const androidGershadCognitoPlugin: GershadCognitoPlugin =
  registerPlugin<GershadCognitoPlugin>("GershadCognitoPlugin");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSystemPlugin: GershadCognitoPlugin = {
  getCognitoId: async () => ({
    cognitoId: "test",
  }),
};

const GershadCognitoPlugin = /*import.meta.env.VITE_BUILD_TYPE === "mock"
    ? mockSystemPlugin
    : */ androidGershadCognitoPlugin;

export default GershadCognitoPlugin;
