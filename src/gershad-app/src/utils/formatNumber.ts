import { replaceArabicNumeralsWithPersianNumerals } from "@asl-19/js-utils";
import { match } from "ts-pattern";

import { LocaleCode } from "src/values/localeValues";

const formatDistance = ({
  localeCode,
  number,
}: {
  decimalPoints?: number;
  localeCode: LocaleCode;
  number: number;
}) =>
  match(Math.abs(number))
    .when(
      (absoluteNumber) => absoluteNumber < 1e3,
      (absoluteNumber) => {
        const fixedNumber = absoluteNumber.toFixed(0);

        return match(localeCode)
          .with("en", () => `${fixedNumber} m`)
          .with("fa", () =>
            replaceArabicNumeralsWithPersianNumerals(`${fixedNumber}`),
          )
          .exhaustive();
      },
    )
    .when(
      (absoluteNumber) => absoluteNumber >= 1e3,
      (absoluteNumber) => {
        const fixedNumber = (absoluteNumber / 1e3).toFixed(0);

        return match(localeCode)
          .with("en", () => `${fixedNumber} km`)
          .with("fa", () =>
            // cSpell:disable-next-line
            replaceArabicNumeralsWithPersianNumerals(`${fixedNumber}كم`),
          )
          .exhaustive();
      },
    )
    .otherwise((absoluteNumber) => `${absoluteNumber} m`);

export default formatDistance;
