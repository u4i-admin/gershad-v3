import { asType } from "@asl-19/js-utils";

import { GqlFaqsPage } from "src/generated/graphQl";

const faqsPageTestData = asType<GqlFaqsPage>({
  faqTitle: "FAQs",
  faqTopics: [
    {
      issues: [
        {
          description: "<p>Topic 1 issue 1 description.</p>",
          faqs: [
            {
              description:
                '<p data-block-key="94zft">Topic 1 issue 1 FAQ 1 description</p>',
              faqId: 1,
              faqText:
                '<p data-block-key="s1qzs">Topic 1 issue 1 FAQ 1 text</p>',
              title: "Topic 1 issue 1 FAQ ",
            },
          ],
          issueFootnotes: [],
          issueId: 2,
          title: "Topic 1 issue 1",
        },
      ],
      title: "Topic 1",
      topicId: 1,
    },
  ],
});

export default faqsPageTestData;
