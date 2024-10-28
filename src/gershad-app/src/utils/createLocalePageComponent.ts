import { NextPage } from "next";

import { Strings } from "src/types/stringTypes";

type PageComponentStaticProperties = {};

type PageComponentLocaleStaticProperties = {
  strings: Strings;
};

export type LocalePageComponent = NextPage &
  PageComponentStaticProperties &
  PageComponentLocaleStaticProperties;

export type PageComponent<Props = {}> = NextPage<Props> &
  PageComponentStaticProperties;

const createLocalePageComponent = ({
  pageComponent,
  strings,
}: {
  pageComponent: NextPage & PageComponentStaticProperties;
  strings: Strings;
}): LocalePageComponent => {
  // We create copies of the server component in server prod so the strings on
  // pageComponent are unique per-locale (otherwise every localePageComponent
  // returned by this object would be the same instance, causing e.g. Persian
  // strings to be rendered in English site, or vice versa).
  //
  // We don’t do this in the browser since the browser only ever has one locale
  // loaded and copying the function has a runtime cost, and we don’t do this in
  // development since it breaks fast refresh.
  const localePageComponent =
    process.env.NODE_ENV === "development" || typeof window !== "undefined"
      ? pageComponent
      : (pageComponent.bind({}) as typeof pageComponent);

  return Object.assign(localePageComponent, {
    strings,
  });
};

export default createLocalePageComponent;
