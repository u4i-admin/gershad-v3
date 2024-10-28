import { match } from "ts-pattern";

import { Direction } from "src/types/layoutTypes";
import { LocaleCode } from "src/values/localeValues";

// We may need to tweak this on a per-language basis
const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

const getLocaleMetadata = (locale: LocaleCode | string) =>
  match<
    string,
    {
      dateTimeFormatter: Intl.DateTimeFormat;
      direction: Direction;
      lang: string;
      localeCode: LocaleCode;
      nativeName: string;
    }
  >(locale)
    .with("en", () => {
      const lang = "en-US";

      return {
        dateTimeFormatter: new Intl.DateTimeFormat(lang, dateTimeFormatOptions),
        direction: "ltr",
        lang,
        localeCode: "en",
        nativeName: "English",
      };
    })
    .otherwise(() => {
      const lang = "fa-IR";

      return {
        dateTimeFormatter: new Intl.DateTimeFormat(lang, dateTimeFormatOptions),
        direction: "rtl",
        lang,
        localeCode: "fa",
        nativeName: "فارسی",
      };
    });

export default getLocaleMetadata;
