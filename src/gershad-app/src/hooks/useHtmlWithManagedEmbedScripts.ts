import { useEffect, useMemo } from "react";

const useHtmlWithManagedEmbedScripts = ({ html }: { html: string }) => {
  /** Raw HTML of all script tags in paragraph HTML */
  const scriptElementHtmlStringsRaw =
    html.match(/(<script[^>]*>.*<\/script>)|(<script[^>]*\/>)/g) ?? [];

  /** HTML of all script tags with service-specific sanitizations applied. */
  const scriptElementHtmlStringsSanitized = scriptElementHtmlStringsRaw.map(
    (scriptElementHtmlString) =>
      scriptElementHtmlString
        // Remove data-telegram-post attributes of Telegram scripts
        //
        // This allows the the script to be deduplicated, and allows it to act on
        // all Telegram <script data-telegram-post="[postId]"> placeholders, not
        // just the one.
        .replace(/data-telegram-post="[\w/]+"/, ""),
  );

  /** Sanitized and deduplicated script HTML strings. */
  const scriptElementHtmlStrings = useMemo(
    () => Array.from(new Set(scriptElementHtmlStringsSanitized)),
    [scriptElementHtmlStringsSanitized],
  );

  const htmlWithoutScripts = scriptElementHtmlStrings.reduce(
    (acc, scriptMatch) => {
      /** The script HTML to remove from the rendered HTML. */
      const htmlToRemove =
        // For Telegram scripts remove the src attribute of the script but
        // leave the rest since the <script> element is the placeholder
        // element that’s replaced by the Telegram script, so we need to leave
        // an inert placeholder script like this:
        //
        // <script async="" data-telegram-post="telegram/1748" data-width="100%"></script>
        scriptMatch.includes("telegram")
          ? scriptMatch.match(/src="[^"]+"/)?.[0] ?? ""
          : scriptMatch;

      return acc.replaceAll(htmlToRemove, "");
    },
    html,
  );

  useEffect(() => {
    const scriptElements = scriptElementHtmlStrings
      .map((scriptMatch) => {
        const scriptElement = document
          .createRange()
          .createContextualFragment(scriptMatch).firstChild;

        // There should never be a case where scriptElement isn’t an
        // HTMLScriptElement but in the interest of safety verify this (and
        // reduce out the null elements below)
        if (!(scriptElement instanceof HTMLScriptElement)) {
          return null;
        }

        // Instagram-specific fixes (Instagram not currently supported but
        // leaving this in case support is added in the future)
        if (scriptElement.src.includes("instagram")) {
          // Tell the global instgrm object to process the embeds once it’s
          // loaded
          scriptElement.onload = () => {
            window.instgrm?.Embeds?.process();
          };

          // Replace  src since as of 2023-03-17 the oEmbed inexplicably returns
          // http://platform.instagram.com/en_US/embeds.js, which is insecure
          // and triggers a redirect (breaking the above onload)
          scriptElement.src = "https://www.instagram.com/embed.js";
        }

        return scriptElement;
      })
      .reduce(
        (acc, scriptElement) =>
          scriptElement instanceof HTMLScriptElement
            ? [...acc, scriptElement]
            : acc,
        [],
      );

    scriptElements.forEach((scriptElement) => {
      document.body.appendChild(scriptElement);
    });

    return () => {
      scriptElements.forEach((scriptElement) => {
        document.body.removeChild(scriptElement);
      });
    };
  }, [scriptElementHtmlStrings]);

  return { htmlWithoutScripts };
};

export default useHtmlWithManagedEmbedScripts;
