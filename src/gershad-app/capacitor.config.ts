import { CapacitorConfig } from "@capacitor/cli";
import child_process from "node:child_process";

const getMacOsNetworkInterfaceIpAddress = (interfaceName: string) => {
  try {
    return child_process
      .execSync(`ipconfig getifaddr ${interfaceName}`)
      .toString()
      .trim();
  } catch {
    return null;
  }
};

const server: CapacitorConfig["server"] = (() => {
  if (process.env.CAPACITOR_ENABLE_DEV_SERVER) {
    const localIpAddress =
      getMacOsNetworkInterfaceIpAddress("en0") ||
      getMacOsNetworkInterfaceIpAddress("en1") ||
      getMacOsNetworkInterfaceIpAddress("en2");

    return {
      cleartext: true,
      url: `http://${localIpAddress}:3000`,
    };
  }

  return {
    cleartext: false,
  };
})();

const config: CapacitorConfig = {
  android: {
    flavor: process.env.NEXT_PUBLIC_ANDROID_FLAVOR ?? "googlePlay",
  },
  appId: "com.gershad.gershad",
  appName: "Gershad",
  cordova: {},
  ios: {},
  plugins: {
    FirebaseAnalytics: {},
    LocalNotifications: {
      smallIcon: "res://drawable/icon",
    },
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
  server,
  webDir: "out",
};

export default config;
