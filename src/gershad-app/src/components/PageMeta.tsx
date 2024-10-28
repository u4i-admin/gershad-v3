import { getAbsoluteUrl } from "@asl-19/js-utils";
import Head from "next/head";
import { StaticImageData } from "next/image";
import { FC, memo } from "react";

import logoPrimaryOpenGraphPng from "src/static/pageMetaImages/logoPrimaryOpenGraph.png";
import logoPrimaryTwitterPng from "src/static/pageMetaImages/logoPrimaryTwitter.png";
import { useAppLocaleInfo, useAppStrings } from "src/stores/appStore";
import getLocaleMetadata from "src/utils/getLocaleMetadata";
import { LocaleCode, localeCodes } from "src/values/localeValues";

export type PageMetaStrings = {
  /**
   * Page title + site title (e.g. "Settings — Gershad").
   *
   * Used if the page has a title.
   *
   * @param pageTitle - Title of page (e.g. "Settings")
   * @param siteTitle - Title of page (e.g. "Gershad")
   */
  pageTitleAndSiteTitle: string;
};

// TODO: Re-enable image argument, uncomment image code, and remove
// eslint-disable once GraphQL is implemented:
//
/* eslint-disable @typescript-eslint/no-unused-vars */

const PageMeta: FC<{
  canonicalPath: string;
  image?: StaticImageData;
  title: string | null;
}> = memo(({ canonicalPath, image, title }) => {
  const { localeCode } = useAppLocaleInfo();
  const { PageMeta: pageMetaStrings, shared: sharedStrings } = useAppStrings();

  const renderedTitle = title
    ? pageMetaStrings.pageTitleAndSiteTitle
        .replace("{pageTitle}", title)
        .replace("{siteTitle}", sharedStrings.siteTitle)
    : sharedStrings.siteTitle;

  const openGraphImage = image ?? logoPrimaryOpenGraphPng;
  const twitterImage = image ?? logoPrimaryTwitterPng;

  const canonicalUrl = getAbsoluteUrl({
    protocolAndHost: process.env.NEXT_PUBLIC_WEB_URL,
    rootRelativeUrl: canonicalPath,
  });

  /**
   * Alternate locale `<link>`s
   *
   * See https://developers.google.com/search/docs/advanced/crawling/localized-versions
   */
  const alternateLocaleLinks = localeCodes
    .filter((localeCodesItem) => localeCodesItem !== localeCode)
    .map((alternateLocaleCode, index) => {
      const canonicalUrl = getAbsoluteUrl({
        protocolAndHost: process.env.NEXT_PUBLIC_WEB_URL,
        rootRelativeUrl: canonicalPath.replace(
          new RegExp(`^/${localeCode}`),
          `/${alternateLocaleCode}`,
        ),
      });

      const { lang } = getLocaleMetadata(localeCodes[index] as LocaleCode);

      return (
        <link
          rel="alternate"
          href={canonicalUrl}
          hrefLang={lang}
          key={alternateLocaleCode}
        />
      );
    });

  return (
    <Head>
      <title>{renderedTitle}</title>
      <meta property="og:title" content={title || sharedStrings.siteTitle} />
      <meta name="twitter:title" content={title || sharedStrings.siteTitle} />

      {/* Image */}
      <meta
        property="og:image"
        content={`${process.env.NEXT_PUBLIC_WEB_URL}${openGraphImage.src}`}
      />
      <meta property="og:image:width" content={`${openGraphImage.width}`} />
      <meta property="og:image:height" content={`${openGraphImage.height}`} />
      <meta
        name="twitter:image"
        content={`${process.env.NEXT_PUBLIC_WEB_URL}${twitterImage.src}`}
      />

      {/* --------------------------------
        --- Canonical and alternate URLs ---
        -------------------------------- */}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />

      {alternateLocaleLinks}
    </Head>
  );
});

PageMeta.displayName = "PageMeta";

export default PageMeta;
