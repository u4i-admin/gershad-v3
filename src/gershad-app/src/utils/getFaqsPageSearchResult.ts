import striptags from "striptags";

import { KnowYourRightsListItemInfo } from "src/components/KnowYourRightsPage/KnowYourRightsListItem";
import routeUrls from "src/routeUrls";
import { FaqsPageContent } from "src/stores/appStore";

const getFaqsPageSearchResult = ({
  pageContent,
  searchQuery,
}: {
  pageContent: FaqsPageContent;
  searchQuery: string;
}): Array<KnowYourRightsListItemInfo> => {
  if (!pageContent) {
    return [];
  }

  return (
    pageContent.faqTopics?.reduce((acc, topic) => {
      /**
       * Return only parent's info if parent's title matches search Query
       */
      if (topic.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return [
          ...acc,
          {
            description: null,
            id: topic.topicId,
            title: topic.title,
            url: routeUrls.faqs({
              query: searchQuery,
              topicId: topic.topicId,
            }),
          } as KnowYourRightsListItemInfo,
        ];
      } else {
        const issueListItemInfo = topic?.issues?.reduce((acc1, issue) => {
          if (!issue) return null;

          if (
            issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            striptags(issue.description ?? "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          ) {
            return [
              ...acc1,
              {
                description: issue.description,
                id: issue.issueId,
                title: issue.title,
                url: routeUrls.faqs({
                  issueId: issue.issueId,
                  query: searchQuery,
                  topicId: topic.topicId,
                }),
              } as KnowYourRightsListItemInfo,
            ];
          } else {
            const faqListItemInfo = issue?.faqs?.reduce((acc2, faq) => {
              if (!faq) return null;

              if (
                faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                striptags(faq.description ?? "")
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                striptags(faq.faqText)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              ) {
                return [
                  ...acc2,
                  {
                    description: faq.description,
                    id: faq.faqId,
                    title: faq.title,
                    url: routeUrls.faqs({
                      faqId: faq.faqId,
                      issueId: issue.issueId,
                      query: searchQuery,
                      topicId: topic.topicId,
                    }),
                  } as KnowYourRightsListItemInfo,
                ];
              }

              return acc2;
            }, []);

            return faqListItemInfo ? [...acc1, ...faqListItemInfo] : acc1;
          }
        }, []);

        return issueListItemInfo ? [...acc, ...issueListItemInfo] : acc;
      }
    }, []) ?? []
  );
};

export default getFaqsPageSearchResult;
