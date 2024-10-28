import { asType } from "@asl-19/js-utils";

import { GqlKnowYourRightsPage } from "src/generated/graphQl";

const knowYourRightsPageTestData = asType<GqlKnowYourRightsPage>({
  chapters: [
    {
      chapterId: 1,
      description: "<p>Chapter 1 description</p>",
      sections: [
        {
          description: "<p>Chapter 1 section 1 description</p>",
          sectionFootnotes: [],
          sectionId: 1,
          sectionText: "<p>Chapter 1 section 1 text</p>",
          title: "Chapter 1 section 1",
        },
        {
          description: "<p>Chapter 1 section 2 description</p>",
          sectionFootnotes: [],
          sectionId: 2,
          sectionText: "<p>Chapter 1 section 2 text</p>",
          title: "Chapter 1 section 2",
        },
      ],
      title: "Chapter 1",
    },
    {
      chapterId: 3,
      description: "<p>Chapter 2 description</p>",
      sections: [
        {
          description: "<p>Chapter 2 section 1 description</p>",
          sectionFootnotes: [],
          sectionId: 1,
          sectionText: "<p>Chapter 2 section 1 text</p>",
          title: "Chapter 2 section 1",
        },
      ],
      title: "Chapter 2",
    },
  ],
  title: "Know your rights",
});

export default knowYourRightsPageTestData;
