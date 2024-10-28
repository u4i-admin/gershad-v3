import { css } from "@emotion/react";
import { useEffect, useState } from "react";

import AppBarTop from "src/components/AppBarTop";
import HtmlContent from "src/components/HtmlContent";
import PageContent from "src/components/Page/PageContent";
import PageContainer from "src/components/PageContainer";
import PageMeta from "src/components/PageMeta";
import { GqlStaticPage } from "src/generated/graphQl";
import routeUrls from "src/routeUrls";
import { useAppDispatch, useAppStrings } from "src/stores/appStore";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";
import { PageComponent } from "src/utils/createLocalePageComponent";

// =============
// === Types ===
// =============

export type AboutPageStrings = {
  /**
   * Page title. Used in header and SEO tags.
   */
  pageTitle: string;
};

const pageContainer = css({
  paddingBlock: "1rem",
});

// ==============================
// === Next.js page component ===
// ==============================

const AboutPage: PageComponent = () => {
  const strings = useAppStrings();
  const dispatch = useAppDispatch();

  const [aboutPageContent, setAboutPageContent] = useState<GqlStaticPage>();

  useEffect(() => {
    const getPageContent = async () => {
      try {
        const graphQlSdk = await getGraphQlSdk();

        const staticPageResponse = await graphQlSdk.getStaticPage({
          staticPageSlug: "about",
        });

        const staticPage = staticPageResponse.staticPage;

        if (!staticPage) {
          dispatch({
            messageStringKey: "shared.toasts.dataLoadFailed",
            messageType: "error",
            type: "snackbarQueued",
          });
        } else {
          setAboutPageContent(staticPage);
        }
      } catch (error) {
        console.error(
          "[SettingsPage] Error while getting page content:",
          error,
        );

        dispatch({
          messageStringKey: "shared.toasts.dataLoadFailed",
          messageType: "error",
          type: "snackbarQueued",
        });
      }
    };

    getPageContent();
  }, [dispatch, strings]);

  return (
    <>
      <PageMeta
        canonicalPath={routeUrls.about()}
        title={strings.AboutPage.pageTitle}
      />

      <AppBarTop
        headingText={strings.AboutPage.pageTitle}
        url={routeUrls.home()}
      />

      <PageContent isScrollable>
        <PageContainer css={pageContainer} maxWidth="md">
          <HtmlContent dangerousHtml={aboutPageContent?.body ?? ""} />
        </PageContainer>
      </PageContent>
    </>
  );
};

export default AboutPage;
