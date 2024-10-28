import { match } from "ts-pattern";

import { LocaleCode } from "src/values/localeValues";

const updateDocumentLocaleAttributes = (localeCode: LocaleCode) => {
  const { dir, lang } = match(localeCode)
    .with("fa", () => ({ dir: "rtl", lang: "fa" }))
    .otherwise(() => ({ dir: "ltr", lang: "en" }));

  document.documentElement.setAttribute("class", `${dir} ${localeCode}`);
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);
};

export default updateDocumentLocaleAttributes;
