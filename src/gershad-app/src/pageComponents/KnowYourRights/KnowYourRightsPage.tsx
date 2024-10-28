import { getNormalizedQuery } from "@asl-19/js-utils";
import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import useLoadKnowYourRightPageContent from "src/hooks/useLoadKnowYourRightPageContent";
import useReplaceUrlIfKnowYourRightsListInfoIsInvalid from "src/hooks/useReplaceUrlIfKnowYourRightsListInfoIsInvalid";
import { KnowYourRightsListInfo } from "src/pageComponents/Faqs/FaqsPage";
import routeUrls from "src/routeUrls";
import { useAppStrings } from "src/stores/appStore";
import { PageComponent } from "src/utils/createLocalePageComponent";

export type KnowYourRightsPageStrings = {
  /**
   * Page title. Used in header and SEO tags.
   */
  pageTitle: string;
};

// ==============
// === Styles ===
// ==============

const pageContainer = css({
  paddingBlock: "1rem",
});
const listContainer = css({
  padding: "2rem 0",
});

// ======================
// === Page component ===
// ======================

const KnowYourRightsPage: PageComponent = () => {
  const router = useRouter();

  const strings = useAppStrings();

  const [searchQuery, setSearchQuery] = useState<string>();

  const pageContent = useLoadKnowYourRightPageContent();

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
        // Based on the structure of src/pages/know-your-rights/chapters
        chapterId: number | null;
        sectionId: number | null;
      }>({
        defaults: {
          chapterId: null,
          sectionId: null,
        },
        query: router.query,
        types: {
          chapterId: "number",
          sectionId: "number",
        },
      }),
    [router.query],
  );

  const getPageContentChapterById = useCallback(
    (chapterId: number) =>
      pageContent?.chapters?.find((chapter) => chapter.chapterId === chapterId),
    [pageContent?.chapters],
  );

  const listInfo = useMemo(() => {
    if (!pageContent) {
      return pageContent;
    }

    return match(normalizedQuery)
      .returnType<KnowYourRightsListInfo>()
      .with(
        { chapterId: P.number, sectionId: P.number },
        ({ chapterId, sectionId }) => {
          const chapter = getPageContentChapterById(chapterId);

          const section = chapter?.sections?.find(
            (section) => section.sectionId === sectionId,
          );

          return {
            activeTitle: section?.title ?? "",
            contentBlock: section ?? null,
            footnotes: section?.sectionFootnotes,
            listItemInfos: null,
            previousPageUrl: chapter?.chapterId
              ? routeUrls.knowYourRights({
                  chapterId: chapter.chapterId,
                  query: searchQuery,
                })
              : // Return to search page if there's search query
                searchQuery
                ? routeUrls.knowYourRightsSearch({ query: searchQuery })
                : routeUrls.home(),
          };
        },
      )
      .with({ chapterId: P.number }, ({ chapterId }) => {
        const chapter = getPageContentChapterById(chapterId);

        const listItemInfos = chapter?.sections
          ? chapter.sections.reduce<Array<KnowYourRightsListItemInfo>>(
              (acc, chapterSection) =>
                chapterSection
                  ? [
                      ...acc,
                      {
                        description: null,
                        id: chapterSection.sectionId,
                        title: chapterSection.title,
                        url: routeUrls.knowYourRights({
                          chapterId: chapter.chapterId,
                          query: searchQuery,
                          sectionId: chapterSection.sectionId,
                        }),
                      },
                    ]
                  : acc,
              [],
            )
          : null;

        return {
          activeTitle: chapter?.title ?? "",
          contentBlock: null,
          listItemInfos,
          // Return to search page if there's search query
          previousPageUrl: searchQuery
            ? routeUrls.knowYourRightsSearch({ query: searchQuery })
            : routeUrls.knowYourRights(),
          variant: "sectionId",
        };
      })
      .otherwise(() => {
        const listItemInfos = pageContent?.chapters
          ? pageContent?.chapters.reduce<Array<KnowYourRightsListItemInfo>>(
              (acc, chapter) =>
                chapter
                  ? [
                      ...acc,
                      {
                        description: null,
                        id: chapter.chapterId,
                        title: chapter.title,
                        url: routeUrls.knowYourRights({
                          chapterId: chapter.chapterId,
                          query: searchQuery,
                        }),
                      },
                    ]
                  : acc,
              [],
            )
          : null;

        return {
          activeTitle: strings.KnowYourRightsPage.pageTitle,
          contentBlock: null,
          enableSearch: true,
          listItemInfos,
          // Return to search page if there's search query
          previousPageUrl: searchQuery
            ? routeUrls.knowYourRightsSearch({ query: searchQuery })
            : routeUrls.home(),
        };
      });
  }, [
    getPageContentChapterById,
    normalizedQuery,
    pageContent,
    searchQuery,
    strings.KnowYourRightsPage.pageTitle,
  ]);

  useReplaceUrlIfKnowYourRightsListInfoIsInvalid({
    listInfo,
    url: routeUrls.knowYourRights(),
  });

  return match(listInfo)
    .with(null, () => null)
    .with(P.not(P.nullish), (listInfo) => (
      <>
        <PageMeta
          canonicalPath={routeUrls.knowYourRights({ chapterId: undefined })}
          title={strings.KnowYourRightsPage.pageTitle}
        />

        {searchQuery ? (
          <AppSearchBarTop
            searchQuery={searchQuery}
            previousPageUrl={routeUrls.knowYourRightsSearch({
              query: searchQuery,
            })}
            searchUrl={routeUrls.knowYourRightsSearch({ query: searchQuery })}
          />
        ) : (
          <AppBarTop
            headingText={listInfo.activeTitle}
            url={listInfo.previousPageUrl}
          />
        )}

        <PageContent isScrollable>
          <PageContainer css={pageContainer} maxWidth="md">
            {listInfo.enableSearch && (
              <SearchBox url={routeUrls.knowYourRightsSearch()} />
            )}

            {listInfo.contentBlock ? (
              <KnowYourRightsChildPageContent
                title={listInfo.contentBlock.title}
                content={listInfo.contentBlock["sectionText"]}
                footnotes={listInfo.footnotes}
              />
            ) : listInfo.listItemInfos ? (
              <>
                <KnowYourRightsList
                  listItemInfos={listInfo.listItemInfos}
                  css={listContainer}
                />
              </>
            ) : null}
          </PageContainer>
        </PageContent>
      </>
    ))
    .otherwise(() => <PageContentLoadingIndicator />);
};

export default KnowYourRightsPage;
