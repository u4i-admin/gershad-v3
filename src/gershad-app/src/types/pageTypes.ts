import { NextPage } from "next";

import { Strings } from "src/types/stringTypes";

export type PageComponentStaticProperties = {};

export type PageComponentLocaleStaticProperties = {
  strings?: Strings;
};

export type LocalizedPageComponentStaticProperties =
  PageComponentStaticProperties & PageComponentLocaleStaticProperties;

export type GershadPageComponent<Props = {}> = NextPage<Props> &
  PageComponentStaticProperties;
