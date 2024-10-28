import { GraphQLClient } from "graphql-request";

import { getSdk } from "src/generated/graphQl";
import { SdkWithHasAccessToken } from "src/types/apiTypes";

type GraphQlRequestMethod = "GET" | "POST";

const getClient = ({
  method,
  signal,
}: {
  method: GraphQlRequestMethod;
  signal?: AbortSignal;
}) =>
  new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_URL, {
    fetch,
    jsonSerializer: {
      parse: JSON.parse,
      stringify: JSON.stringify,
    },
    method,
    signal,
  });

/**
 * Get a unique instance of GraphQL that will abort its request after the
 * specified timeout (defaults to 10s).
 *
 * Supports passing a custom abortController, which is useful if you need the
 * ability to abort the request earlier.
 *
 * @param abortController - Instance of AbortController. Can cancel request from
 * outside with abortController.abort().
 *
 * @param timeout - Timeout before abort in ms.
 */
const getGraphQlSdk = async ({
  abortController = new AbortController(),
  method = "GET",
  timeout = 30000,
}: {
  abortController?: AbortController;
  method?: GraphQlRequestMethod;
  timeout?: number;
} = {}): Promise<SdkWithHasAccessToken> => {
  setTimeout(() => {
    abortController.abort();
  }, timeout);

  const client = getClient({ method, signal: abortController?.signal });

  const accessToken = null;

  const graphQlSdk = getSdk(client, async (action) => {
    const requestHeaders = accessToken
      ? {
          Authorization: `JWT ${accessToken}`,
        }
      : undefined;

    const result = await action(requestHeaders);

    return result;
  });

  const graphQlSdkWithHasAccessToken = {
    ...graphQlSdk,
    hasAccessToken: !!accessToken,
  };

  return Promise.resolve(graphQlSdkWithHasAccessToken);
};

export default getGraphQlSdk;
