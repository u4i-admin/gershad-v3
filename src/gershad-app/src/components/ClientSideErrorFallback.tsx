import { css } from "@emotion/react";
import Stack from "@mui/material/Stack";
import { FC, memo } from "react";
import { FallbackProps } from "react-error-boundary";

import Layout from "src/components/Layout";
import PageContent from "src/components/Page/PageContent";
import PageContainer from "src/components/PageContainer";
import { useAppStrings } from "src/stores/appStore";

// =============
// === Types ===
// =============

export type ClientSideErrorFallbackStrings = {
  description: string;
  title: string;
};

const heading = css({
  fontSize: "2rem",
  textAlign: "center",
});

const descriptionParagraph = css({
  maxWidth: "40rem",
});

const errorStack = css({ maxWidth: "100%" });

const ClientSideErrorFallback: FC<FallbackProps> = memo(({ error }) => {
  const strings = useAppStrings();

  const description = strings.ClientSideErrorFallback.description;

  const titleLocalized = strings.ClientSideErrorFallback.title;

  return (
    <Layout>
      <PageContent isScrollable>
        <PageContainer>
          <Stack direction="column" rowGap="1rem" padding="2rem 0">
            <h1 css={heading} id="main-heading">
              {titleLocalized}
            </h1>

            <p css={descriptionParagraph}>{description}</p>

            <pre css={errorStack} dir="ltr">
              {error.stack}
            </pre>
          </Stack>
        </PageContainer>
      </PageContent>
    </Layout>
  );
});

ClientSideErrorFallback.displayName = "ClientSideErrorFallback";

export default ClientSideErrorFallback;
