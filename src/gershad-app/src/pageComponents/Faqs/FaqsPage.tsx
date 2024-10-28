/* eslint-disable @typescript-eslint/no-explicit-any */
import { getNormalizedQuery } from "@asl-19/js-utils";
import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { match, P } from "ts-pattern";

import AppBarTop from "src/components/AppBarTop";
import AppSearchBarTop from "src/components/AppSearchBarTop";
import KnowYourRightsChildPageContent from "src/components/KnowYourRightsPage/KnowYourRightsChildPageContent";
import KnowYourRightsList from "src/components/KnowYourRightsPage/KnowYourRightsList";
import { KnowYourRightsListItemInfo } from "src/components/KnowYourRightsPage/KnowYourRightsListItem";
import SearchBox from "src/components/KnowYourRightsPage/SearchBox";
import PageContent from "src/components/Page/PageContent";
import PageContentLoadingIndicator from "src/components/Page/PageContentLoadingIndicator";
import PageContainer from "src/components/PageContainer";
import PageMeta from "src/components/PageMeta";
import { GqlChapterSectionBlock, GqlFaqBlock } from "src/generated/graphQl";
import useLoadFaqsPageContent from "src/hooks/useLoadFaqsPageContent";
import useReplaceUrlIfFaqsListInfoIsInvalid from "src/hooks/useReplaceUrlIfFaqsListInfoIsInvalid";
import routeUrls from "src/routeUrls";
import { useAppStrings } from "src/stores/appStore";
import { Footnote } from "src/types/apiTypes";
import { PageComponent } from "src/utils/createLocalePageComponent";

// =============
// === Types ===
// =============

const pageContainer = css({
  paddingBlock: "1rem",
});
const listContainer = css({
  padding: "2rem 0",
});

// ==============================
// === Next.js page component ===
// ==============================

export type KnowYourRightsListInfo = {
  activeTitle: string;
  contentBlock: GqlFaqBlock | GqlChapterSectionBlock | null;
  enableSearch?: boolean;
  footnotes?: Array<Footnote> | null;
  listItemInfos: Array<KnowYourRightsListItemInfo> | null;
  previousPageUrl: string;
};

const FaqsPage: PageComponent = () => {
  const router = useRouter();
  const strings = useAppStrings();

  const pageContent = useLoadFaqsPageContent();

  const [searchQuery, setSearchQuery] = useState<string>();

  useEffect(() => {
    const query = router.query.query ?? null;

    if (query) {
      // Convert the query to a string if it's an array
      const searchString = Array.isArray(query) ? query.join(", ") : query;
      setSearchQuery(searchString);
    }
  }, [router.query]);

  const normalizedQuery = useMemo(
    () =>
      getNormalizedQuery<{
        // Based on the structure of src/pages/know-your-rights/faqs
        faqId: number | null;
        issueId: number | null;
        topicId: number | null;
      }>({
        defaults: {
          faqId: null,
          issueId: null,
          topicId: null,
        },
        query: router.query,
        types: {
          faqId: "number",
          issueId: "number",
          topicId: "number",
        },
      }),
    [router.query],
  );

  const listInfo: KnowYourRightsListInfo | null | undefined = useMemo(() => {
    if (!pageContent) {
      return pageContent;
    }

    return match(normalizedQuery)
      .returnType<KnowYourRightsListInfo>()
      .with(
        {
          faqId: P.number,
          issueId: P.number,
          topicId: P.number,
        },
        ({ faqId, issueId, topicId }) => {
          const topic = pageContent?.faqTopics?.filter(
            (faq) => faq.topicId === topicId,
          )[0];

          const issueList = (topic?.issues || []).reduce(
            (acc, edge) => (edge ? [...acc, edge] : acc),
            [],
          );

          const issue = issueList.filter((faq) => faq.issueId === issueId)[0];

          const faqsList = (issue?.faqs || []).reduce(
            (acc, edge) => (edge ? [...acc, edge] : acc),
            [],
          );

          const faq = faqsList.filter((faq) => faq.faqId === faqId)[0];

          return {
            activeTitle: faq?.title ?? "",
            contentBlock: faq,
            footnotes: issue.issueFootnotes,
            listItemInfos: [],
            previousPageUrl: routeUrls.faqs({
              issueId,
              query: searchQuery,
              topicId,
            }),
          };
        },
      )
      .with(
        { issueId: P.number, topicId: P.number },
        ({ issueId, topicId }) => {
          const topic = pageContent?.faqTopics?.filter(
            (faq) => faq.topicId === topicId,
          )[0];

          const issueList = (topic?.issues || []).reduce(
            (acc, edge) => (edge ? [...acc, edge] : acc),
            [],
          );

          const issue = issueList?.filter((faq) => faq.issueId === issueId)[0];

          const listItemInfos = issue?.faqs
            ? issue.faqs.reduce<Array<KnowYourRightsListItemInfo>>(
                (acc, faq) =>
                  faq
                    ? [
                        ...acc,
                        {
                          description: null,
                          id: faq.faqId,
                          title: faq.title,
                          url: routeUrls.faqs({
                            faqId: faq.faqId,
                            issueId,
                            query: searchQuery,
                            topicId,
                          }),
                        },
                      ]
                    : acc,
                [],
              )
            : null;

          return {
            activeTitle: issue?.title ?? "",
            contentBlock: null,
            listItemInfos,
            previousPageUrl: routeUrls.faqs({
              query: searchQuery,
              topicId,
            }),
          };
        },
      )
      .with({ topicId: P.number }, ({ topicId }) => {
        const topic = pageContent?.faqTopics?.filter(
          (faq) => faq.topicId === topicId,
        )[0];

        const listItemInfos = topic?.issues
          ? topic.issues.reduce<Array<KnowYourRightsListItemInfo>>(
              (acc, issue) =>
                issue
                  ? [
                      ...acc,
                      {
                        description: null,
                        id: issue.issueId,
                        title: issue.title,
                        url: routeUrls.faqs({
                          issueId: issue.issueId,
                          query: searchQuery,
                          topicId,
                        }),
                      },
                    ]
                  : acc,
              [],
            )
          : null;

        return {
          activeTitle: topic?.title ?? "",
          contentBlock: null,
          listItemInfos,
          previousPageUrl: routeUrls.faqs({
            query: searchQuery,
          }),
        };
      })
      .otherwise(() => {
        const listItemInfos = pageContent?.faqTopics
          ? pageContent?.faqTopics.reduce<Array<KnowYourRightsListItemInfo>>(
              (acc, topic) =>
                topic
                  ? [
                      ...acc,
                      {
                        description: null,
                        id: topic.topicId,
                        title: topic.title,
                        url: routeUrls.faqs({
                          query: searchQuery,
                          topicId: topic.topicId,
                        }),
                      },
                    ]
                  : acc,
              [],
            )
          : null;

        return {
          activeTitle: pageContent?.faqTitle ?? "",
          contentBlock: null,
          enableSearch: true,
          listItemInfos,
          // Return to search page if there's search query
          previousPageUrl: searchQuery
            ? routeUrls.knowYourRightsSearch({ query: searchQuery })
            : routeUrls.home(),
        };
      });
  }, [normalizedQuery, pageContent, searchQuery]);

  useReplaceUrlIfFaqsListInfoIsInvalid({
    listInfo,
    url: routeUrls.faqs(),
  });

  return match(listInfo)
    .with(null, () => null)
    .with(P.not(P.nullish), (listInfo) => (
      <>
        <PageMeta
          canonicalPath={routeUrls.faqs()}
          title={strings.KnowYourRightsPage.pageTitle}
        />

        {searchQuery ? (
          <AppSearchBarTop
            searchQuery={searchQuery}
            searchUrl={routeUrls.faqsSearch({ query: searchQuery })}
            previousPageUrl={routeUrls.faqsSearch({
              query: searchQuery,
            })}
          />
        ) : (
          <AppBarTop
            headingText={listInfo?.activeTitle ?? ""}
            url={listInfo.previousPageUrl}
          />
        )}
        <PageContent isScrollable>
          <PageContainer css={pageContainer} maxWidth="md">
            {listInfo.enableSearch && (
              <SearchBox url={routeUrls.faqsSearch()} />
            )}

            {listInfo.contentBlock && (
              <KnowYourRightsChildPageContent
                title={listInfo.contentBlock.title}
                content={listInfo.contentBlock["faqText"]}
                footnotes={listInfo.footnotes}
              />
            )}
            {listInfo.listItemInfos && (
              <KnowYourRightsList
                listItemInfos={listInfo.listItemInfos}
                css={listContainer}
              />
            )}
          </PageContainer>
        </PageContent>
      </>
    ))
    .otherwise(() => <PageContentLoadingIndicator />);
};

export default FaqsPage;
