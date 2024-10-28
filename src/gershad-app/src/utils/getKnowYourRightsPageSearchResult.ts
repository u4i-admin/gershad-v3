import striptags from "striptags";

import { KnowYourRightsListItemInfo } from "src/components/KnowYourRightsPage/KnowYourRightsListItem";
import routeUrls from "src/routeUrls";
import { KnowYourRightsPageContent } from "src/stores/appStore";

const getKnowYourRightsPageSearchResult = ({
  pageContent,
  searchQuery,
}: {
  pageContent: KnowYourRightsPageContent;
  searchQuery: string;
}): Array<KnowYourRightsListItemInfo> => {
  if (!pageContent) {
    return [];
  }

  return (
    pageContent.chapters?.reduce((acc, chapter) => {
      /**
       * Return only parent's info if parent's title matches search Query
       */
      if (
        /**
         * striptags is used to get only the inner text in HTMLStrings
         */
        chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        striptags(chapter.description ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return [
          ...acc,
          {
            description: chapter.description,
            id: chapter.chapterId,
            title: chapter.title,
            url: routeUrls.knowYourRights({
              chapterId: chapter.chapterId,
              query: searchQuery,
            }),
          } as KnowYourRightsListItemInfo,
        ];
      } else {
        const sectionListItemInfo = chapter?.sections?.reduce(
          (acc1, section) => {
            if (
              section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              striptags(section.description ?? "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              striptags(section.sectionText)
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            ) {
              return [
                ...acc1,
                {
                  description: section.description,
                  id: section.sectionId,
                  title: section.title,
                  url: routeUrls.knowYourRights({
                    chapterId: chapter.chapterId,
                    query: searchQuery,
                    sectionId: section.sectionId,
                  }),
                } as KnowYourRightsListItemInfo,
              ];
            }
            return acc1;
          },
          [],
        );

        return sectionListItemInfo ? [...acc, ...sectionListItemInfo] : acc;
      }
    }, []) ?? []
  );
};

export default getKnowYourRightsPageSearchResult;
