import { match } from "ts-pattern";

import { GqlClientTypeEnum } from "src/generated/graphQl";
import { platform } from "src/values/appValues";

export const apiClientType = match(platform)
  .returnType<GqlClientTypeEnum>()
  .with("android", () => "ANDROID")
  .with("ios", () => "IOS")
  .otherwise(() => "WEB");
