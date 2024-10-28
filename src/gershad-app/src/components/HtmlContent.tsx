import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { memo } from "react";

// eslint-disable-next-line @emotion/syntax-preference
const container = css`
  overflow: hidden;

  p,
  ol,
  ul,
  li,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 0 1rem;

    :last-child {
      margin-bottom: 0;
    }
  }

  ul {
    list-style-type: disc;
  }
  ol {
    padding: 0;

    list-style-position: inside;
  }
  html.en & ol {
    list-style-type: decimal;
  }
  html.fa & ol {
    list-style-type: persian;
  }

  li {
    margin-inline-start: 1.5em;

    list-style-type: inherit;
  }

  h1 {
    font-size: 1.625em;
  }
  h2 {
    font-size: 1.625em;
  }
  h3 {
    font-size: 1.3125em;
  }
  h4,
  h5,
  h6 {
    font-size: 1em;
  }
  b {
    font-weight: 600;
    font-size: 1.125rem;
  }

  /* ====================================
    === Embed aspect ratio preservation ===
    ==================================== */
  /* Based on https://css-tricks.com/responsive-iframes/ */

  /* Give video embeds a default size of 640x360px (not responsive, but better
    than tiny default size. */
  .contains-video[style*="--aspect-ratio"] > * {
    width: 640px;
    max-width: 100%;
    height: 360px;
  }

  /* If the browser can read custom properties: */
  @supports (--custom: property) {
    [style*="--aspect-ratio"] {
      position: relative;

      width: 100%;
      max-width: 40rem;
    }
    /* Because padding is relative to width we can use it as a hack to force
      the aspect ratio of the container. */
    [style*="--aspect-ratio"]::before {
      display: block;
      padding-bottom: calc(100% / (var(--aspect-ratio)));

      content: '""';
    }

    /* Make the iframe fill the space of its sized container div. */
    [style*="--aspect-ratio"] > * {
      position: absolute;
      top: 0;
      left: 0;

      width: 100% !important;
      height: 100% !important;
    }
  }
`;

/**
 * HTML content. Should be used for any rendered HTML strings.
 *
 * **HTML content must be trusted — uses dangerouslySetInnerHTML prop to
 * emphasize this!**
 *
 * Includes:
 *
 * - Reasonable default styles (e.g. margins between blocks, heading font sizes,
 *   and list styles)
 *
 * - Aspect ratio of embedded content (iframes inside divs) is preserved if the
 *   iframe has numerical width and height attributes. YouTube and Vimeo iframes
 *   are set to 16:9 by default.
 */
const HtmlContent: StylableFC<{
  dangerousHtml: string;
}> = memo(({ className, dangerousHtml }) => {
  const processedHtml = dangerousHtml.replace(
    // Wagtail inline embeds are marked up as an iframe wrapped in a div. We get
    // the iframe specifically (note that `iframe` named match is named for
    // convenience — the `iframe` argument below is positional.)

    // @ts-expect-error (all targeted browsers support named capture groups but
    // we can’t change Next.js compiler’s internal ES target)
    /<div>\s*(?<iframe><iframe[^>]*><\/iframe>)\s*<\/div>/gms,
    (match, iframe) => {
      // Get numerical width and height attributes of matched iframe.

      // @ts-expect-error (all targeted browsers support named capture groups
      // but we can’t change Next.js compiler’s internal ES target)
      const width = iframe.match(/width="(?<width>\d+)"/)?.groups?.width;

      // @ts-expect-error (all targeted browsers support named capture groups
      // but we can’t change Next.js compiler’s internal ES target)
      const height = iframe.match(/height="(?<height>\d+)"/)?.groups?.height;

      // Check if the matched iframe has a Vimeo or YouTube src.
      const containsVideo =
        iframe.search(
          /(src="https:\/\/player.vimeo.com|src="https:\/\/www.youtube.com)/,
        ) !== 1;

      // If iframe has numerical width and height set the `--aspect-ratio`
      // custom property, which will be used in the CSS to force the aspect
      // ratio of the containing div.
      //
      // THis approach is based on https://css-tricks.com/responsive-iframes/
      if (width && height) {
        return `<div class="${
          containsVideo ? "contains-video" : ""
        }" style="--aspect-ratio: ${width}/${height}">${iframe}</div>`;
      }

      return match;
    },
  );

  return (
    <div
      className={className}
      css={container}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
});

HtmlContent.displayName = "HtmlContent";

export default HtmlContent;
