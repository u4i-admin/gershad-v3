import type { Sdk } from "src/generated/graphQl";

export type FlatTags = Array<{
  name: string;
  slug: string;
}>;

export type PointFieldType = {
  x: number;
  y: number;
};

export type Footnote = {
  text: string;
  uuid: string;
};

// export type ResponseErrorsByFieldKey = {
//   [fieldKey: string]: Array<GqlAslErrorObject>;
// };

// export type ResponseErrorsFlat = Array<GqlAslErrorObject | null>;

export type SdkWithHasAccessToken = Sdk & {
  hasAccessToken: boolean;
};
