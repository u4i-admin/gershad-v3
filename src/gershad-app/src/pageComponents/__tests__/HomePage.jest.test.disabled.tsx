import HomePage from "src/pageComponents/HomePage";
import { AppProvider } from "src/stores/appStore";
import getMockAppState from "src/utils/test/getMockAppState";
import testRender from "src/utils/test/testRender";
import { LocaleCode } from "src/values/localeValues";

["en", "fa"].forEach((localeCode: LocaleCode) => {
  const appState = getMockAppState({ localeCode });
  const { strings } = appState;

  test(`${localeCode} HomePage renders expected content`, () => {
    const { getByRole } = testRender(
      <AppProvider initialState={getMockAppState({ localeCode })}>
        <HomePage />
      </AppProvider>,
    );

    expect(
      getByRole("heading", { name: strings.shared.siteTitle }),
    ).toBeInTheDocument();
  });
});
