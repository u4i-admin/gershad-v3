import { asType } from "@asl-19/js-utils";

import { GqlStaticPage } from "src/generated/graphQl";

const staticPageTestDataBySlug = {
  // cSpell:disable
  about: asType<GqlStaticPage>({
    body: `
    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance.</p>
    `,
    searchDescription: "About Us SEO description",
    seoTitle: "About Us SEO title",
    slug: "about",
    title:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry",
  }),
  // cSpell:enable
};

export default staticPageTestDataBySlug;
