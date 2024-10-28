import { useEffect, useState } from "react";

import AppBarTop from "src/components/AppBarTop";
import PageContent from "src/components/Page/PageContent";
import PageContainer from "src/components/PageContainer";
import PageMeta from "src/components/PageMeta";
import UserGuideAccordion from "src/components/UserGuidePage/UserGuideAccordion";
import { GqlUserGuidePage } from "src/generated/graphQl";
import routeUrls from "src/routeUrls";
import { useAppDispatch, useAppStrings } from "src/stores/appStore";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";
import { PageComponent } from "src/utils/createLocalePageComponent";
// =============
// === Types ===
// =============

export type UserGuidePageStrings = {
  /**
   * Page title. Used in header and SEO tags.
   */
  pageTitle: string;
};

// ==============================
// === Next.js page component ===
// ==============================

const UserGuidePage: PageComponent = () => {
  const strings = useAppStrings();
  const dispatch = useAppDispatch();

  const [userGuidePageContent, setUserGuidePageContent] =
    useState<GqlUserGuidePage>();

  useEffect(() => {
    const getPageContent = async () => {
      try {
        const graphQlSdk = await getGraphQlSdk();

        const userGuidePageResponse = await graphQlSdk.getUserGuidePage();

        const userGuidePage = userGuidePageResponse.userGuidePage;

        if (!userGuidePage) {
          dispatch({
            messageStringKey: "shared.toasts.dataLoadFailed",
            messageType: "error",
            type: "snackbarQueued",
          });
        } else {
          setUserGuidePageContent(userGuidePage);
        }
      } catch (error) {
        console.error("[UserGuidePage] Error in getPageContent:", error);

        dispatch({
          messageStringKey: "shared.toasts.dataLoadFailed",
          messageType: "error",
          type: "snackbarQueued",
        });
      }
    };

    getPageContent();
  }, [dispatch, strings]);

  const questions = (userGuidePageContent?.questions || []).reduce(
    (acc, edge) => (edge ? [...acc, edge] : acc),
    [],
  );

  return (
    <>
      <PageMeta
        canonicalPath={routeUrls.userGuide()}
        title={
          userGuidePageContent?.seoTitle ?? strings.UserGuidePage.pageTitle
        }
      />

      <AppBarTop
        headingText={strings.UserGuidePage.pageTitle}
        url={routeUrls.home()}
      />

      <PageContent isScrollable>
        <PageContainer disableGutters maxWidth="md">
          {questions.map((question, index) => (
            <UserGuideAccordion question={question} key={index} />
          ))}
        </PageContainer>
      </PageContent>
    </>
  );
};

export default UserGuidePage;
