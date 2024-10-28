import { constructUrl } from "@asl-19/js-utils";

type RouteArgs = {
  [routeArgument: string]: unknown;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Route = (routeArgs: RouteArgs) => string;

const routeUrls = {
  about: () => "/about",
  faqs: ({
    faqId,
    issueId,
    query,
    topicId,
  }: {
    faqId?: number;
    issueId?: number;
    query?: string;
    topicId?: number;
  } = {}) =>
    constructUrl({
      path: `/faqs/topics/${topicId ? `${topicId}/issues/` : ""}${
        issueId ? `${issueId}/faqs/` : ""
      }${faqId ? `${faqId}/` : ""}`,
      querySegments: { query },
    }),
  faqsSearch: ({ query }: { query?: string } = {}) =>
    constructUrl({
      path: `/faqs/search`,
      querySegments: { query },
    }),
  feedback: () => "/feedback",
  home: ({
    bookmark,
    hotzonePk,
    initialPosition,
    reportPk,
  }: {
    bookmark?: "true" | "false";
    hotzonePk?: number;
    initialPosition?: string;
    reportPk?: number;
  } = {}) =>
    constructUrl({
      path: `/`,
      querySegments: {
        bookmark,
        hotzonePk,
        initialPosition,
        reportPk,
      },
    }),

  knowYourRights: ({
    chapterId,
    query,
    sectionId,
  }: {
    chapterId?: number;
    query?: string;
    sectionId?: number;
  } = {}) =>
    constructUrl({
      path: `/know-your-rights/chapters/${
        chapterId ? `${chapterId}/sections/` : ""
      }${sectionId ? `${sectionId}` : ""}`,
      querySegments: { query },
    }),

  knowYourRightsSearch: ({ query }: { query?: string } = {}) =>
    constructUrl({
      path: `/know-your-rights/search`,
      querySegments: { query },
    }),

  pointsOfInterest: () => "/pointsOfInterest",

  reports: ({ reportType }: { reportType?: string } = {}) =>
    constructUrl({
      path: `/reports`,
      querySegments: { reportType },
    }),
  settings: () => "/settings/",
  settingsNotifications: () => "/settings/notifications",
  userGuide: () => "/user-guide/",
} satisfies { [routeName: string]: Route };

export default routeUrls;
