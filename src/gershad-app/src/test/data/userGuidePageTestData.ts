import { asType } from "@asl-19/js-utils";

import { GqlUserGuidePage } from "src/generated/graphQl";

const userGuidePageTestData = asType<GqlUserGuidePage>({
  id: "VXNlckd1aWRlUGFnZU5vZGU6MTQ=",
  numchild: 0,
  questions: [
    {
      answer: "Answer 1",
      icon: {
        id: "4",
        image: {
          height: 156,
          id: "SW1hZ2VOb2RlOjQ=",
          rendition: {
            height: 32,
            id: "35",
            url: "/media/images/Icon.width-32.png",
            width: 32,
          },
          title: "Icon",
          width: 156,
        },
      },
      question: "Question 1",
    },
    {
      answer: "Answer 2",
      icon: {
        id: "4",
        image: {
          height: 156,
          id: "SW1hZ2VOb2RlOjQ=",
          rendition: {
            height: 32,
            id: "35",
            url: "/media/images/Icon.width-32.png",
            width: 32,
          },
          title: "Icon",
          width: 156,
        },
      },
      question: "Question 2",
    },
  ],
  searchDescription: "",
  seoTitle: "",
  slug: "user-guide",
  title: "User Guide",
  urlPath: "/home-fa/user-guide/",
});

export default userGuidePageTestData;
