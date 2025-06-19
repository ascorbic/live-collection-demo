import { ShopifyLoaderError } from "./types.js";

const MOCK_SHOP_API_URL = "https://mock.shop/api";

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

export async function executeGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>,
  apiUrl: string = MOCK_SHOP_API_URL,
  token?: string
): Promise<T> {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Shopify-Storefront-Access-Token": token } : {}),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new ShopifyLoaderError(
        `HTTP error ${response.status}: ${response.statusText}`,
        "HTTP_ERROR",
        response.status
      );
    }

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors.map((e) => e.message).join(", ");
      throw new ShopifyLoaderError(
        `GraphQL error: ${errorMessage}`,
        "GRAPHQL_ERROR"
      );
    }

    if (!result.data) {
      throw new ShopifyLoaderError(
        "No data returned from GraphQL query",
        "NO_DATA"
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof ShopifyLoaderError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ShopifyLoaderError(
        "Network error: Unable to connect to Shopify API",
        "NETWORK_ERROR"
      );
    }

    throw new ShopifyLoaderError(
      `Unexpected error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      "UNKNOWN_ERROR"
    );
  }
}
