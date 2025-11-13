import { getProductsByCollectionName, searchProducts, Collection } from "./shopify";

type ProductImage = {
  url: string;
  altText?: string;
};

type Product = {
  id: string;
  title: string;
  featuredImage?: ProductImage;
  images?: {
    edges: { node: ProductImage }[];
  };
};

export type CollectionData = {
  products: { node: Product }[];
  collectionInfo: Collection | null;
};

/**
 * Server-side function to fetch products from a specific collection
 * This runs on the server during SSR/SSG in Next.js
 *
 * @param collectionHandle - The handle/slug of the collection (e.g., "matcha", "matchaware")
 * @param limit - Maximum number of products to fetch (default: 20)
 * @param fallbackSearch - Whether to fallback to search if collection not found (default: true)
 * @returns Collection data with products and collection info
 */
export async function fetchCollection(
  collectionHandle: string,
  limit: number = 20,
  fallbackSearch: boolean = true
): Promise<CollectionData> {
  try {
    // Try to fetch the collection by handle with no cache
    const collectionData = await getProductsByCollectionName(
      collectionHandle,
      limit
    );

    return {
      products: collectionData.products.edges || [],
      collectionInfo: collectionData.collection,
    };
  } catch (collectionError) {
    console.error(
      `Error fetching collection "${collectionHandle}":`,
      collectionError
    );

    // Fallback to search if enabled
    if (fallbackSearch) {
      try {
        const searchResults = await searchProducts(collectionHandle, limit);
        return {
          products: searchResults.edges || [],
          collectionInfo: null,
        };
      } catch (searchError) {
        console.error(
          `Error searching for "${collectionHandle}":`,
          searchError
        );
      }
    }

    // Return empty data structure on error
    return {
      products: [],
      collectionInfo: null,
    };
  }
}

/**
 * Server-side function to fetch multiple collections at once
 * Useful for pages that need products from multiple collections
 *
 * @param collections - Array of collection configs with handle and optional limit
 * @returns Object with collection handles as keys and their data as values
 */
export async function fetchMultipleCollections(
  collections: Array<{
    handle: string;
    limit?: number;
    fallbackSearch?: boolean;
  }>
): Promise<Record<string, CollectionData>> {
  const promises = collections.map(
    async ({ handle, limit = 20, fallbackSearch = true }) => {
      const data = await fetchCollection(handle, limit, fallbackSearch);
      return { handle, data };
    }
  );

  const results = await Promise.all(promises);

  return results.reduce((acc, { handle, data }) => {
    acc[handle] = data;
    return acc;
  }, {} as Record<string, CollectionData>);
}

/**
 * Convenience function for fetching best sellers data
 * Maintains backwards compatibility with original implementation
 */
export async function fetchBestSellers() {
  const collections = await fetchMultipleCollections([
    { handle: "matcha", limit: 8 },
    { handle: "matchaware", limit: 20 },
  ]);

  return {
    matchaProducts: collections.matcha?.products || [],
    matchaWareProducts: collections.matchaware?.products || [],
    collectionInfo: collections.matcha?.collectionInfo || null,
  };
}
