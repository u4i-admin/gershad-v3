import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import AppSearchBarTop from "src/components/AppSearchBarTop";
import KnowYourRightsList from "src/components/KnowYourRightsPage/KnowYourRightsList";
import { KnowYourRightsListItemInfo } from "src/components/KnowYourRightsPage/KnowYourRightsListItem";
import PageContent from "src/components/Page/PageContent";
import PageContainer from "src/components/PageContainer";
import PageMeta from "src/components/PageMeta";
import useLoadKnowYourRightPageContent from "src/hooks/useLoadKnowYourRightPageContent";
import routeUrls from "src/routeUrls";
import { useAppStrings } from "src/stores/appStore";
import { PageComponent } from "src/utils/createLocalePageComponent";
import getKnowYourRightsPageSearchResult from "src/utils/getKnowYourRightsPageSearchResult";

// =============
// === Types ===
// =============

export type KnowYourRightsSearchPageStrings = {
  /**
   * Text for No Results Found
   */
  noResultsFound: string;
  /**
   * Page SEO title.
   */
  pageTitle: string;
};

// ==============================
// === Next.js page component ===
// ==============================

const pageContainer = css({
  minHeight: "100%",
  paddingBlock: "1rem",
});
const listContainer = css({
  height: "100%",
  padding: "2rem 0",
});

const noResultContainer = css({
  alignItems: "center",
  display: "flex",
  height: "100%",
  justifyContent: "center",
});

const KnowYourRightsSearchPage: PageComponent = () => {
  const strings = useAppStrings();

  const pageContent = useLoadKnowYourRightPageContent();

  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  useEffect(() => {
    const query = router.query.query ?? null;

    if (query) {
      // Convert the query to a string if it's an array
      const searchString = Array.isArray(query) ? query.join(", ") : query;
      setSearchQuery(searchString);
    }
  }, [router.query]);

  const searchResultList: Array<KnowYourRightsListItemInfo> = useMemo(
    () => getKnowYourRightsPageSearchResult({ pageContent, searchQuery }),
    [pageContent, searchQuery],
  );

  return (
    <>
      <PageMeta
        canonicalPath={routeUrls.knowYourRights()}
        title={pageContent?.title ?? strings.KnowYourRightsSearchPage.pageTitle}
      />
      <AppSearchBarTop
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        previousPageUrl={routeUrls.knowYourRights()}
      />
      <PageContent isScrollable>
        <PageContainer css={pageContainer} maxWidth="md">
          <Box css={listContainer}>
            {searchQuery && searchResultList && (
              <KnowYourRightsList listItemInfos={searchResultList} />
            )}

            {searchQuery && searchResultList.length === 0 && (
              <Box css={noResultContainer}>
                <Typography variant="paraMedium" component="span">
                  {strings.KnowYourRightsSearchPage.noResultsFound}
                </Typography>
              </Box>
            )}
          </Box>
        </PageContainer>
      </PageContent>
    </>
  );
};

export default KnowYourRightsSearchPage;
