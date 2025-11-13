// ========== TYPE DEFINITIONS ==========
export interface ShopifyError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: Record<string, unknown>;
}

export interface ShopifyResponse<T = unknown> {
  data?: T;
  errors?: ShopifyError[];
}

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Image {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice?: Money;
  image?: Image;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  availableForSale: boolean;
  totalInventory?: number;
  options: ProductOption[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange?: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  images: {
    edges: Array<{ node: Image }>;
  };
  featuredImage?: Image;
  variants: {
    edges: Array<{ node: ProductVariant }>;
  };
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: ProductVariant & {
    product: Pick<Product, "id" | "handle" | "title" | "featuredImage">;
  };
}

export interface Cart {
  id: string;
  createdAt: string;
  updatedAt: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: Money;
    subtotalAmount: Money;
    totalTaxAmount?: Money;
    totalDutyAmount?: Money;
  };
  buyerIdentity?: {
    email?: string;
    phone?: string;
    countryCode?: string;
  };
  lines: {
    edges: Array<{ node: CartLine }>;
  };
  attributes: Array<{ key: string; value: string }>;
  discountCodes: Array<{
    applicable: boolean;
    code: string;
  }>;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  updatedAt: string;
  image?: Image;
  products?: {
    edges: Array<{ node: Product }>;
    pageInfo: PageInfo;
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface ProductConnection {
  pageInfo: PageInfo;
  edges: Array<{
    cursor: string;
    node: Product;
  }>;
}

// ========== BLOG TYPE DEFINITIONS ==========
export interface BlogAuthor {
  bio?: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
}

export interface Article {
  id: string;
  handle: string;
  title: string;
  content: string;
  contentHtml: string;
  excerpt?: string;
  excerptHtml?: string;
  publishedAt: string;
  tags: string[];
  author?: BlogAuthor;
  authorV2?: BlogAuthor;
  blog: {
    id: string;
    handle: string;
    title: string;
  };
  image?: Image;
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface Blog {
  id: string;
  handle: string;
  title: string;
  articles: {
    edges: Array<{ node: Article }>;
    pageInfo: PageInfo;
  };
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface ArticleConnection {
  pageInfo: PageInfo;
  edges: Array<{
    cursor: string;
    node: Article;
  }>;
}

export interface SearchConnection {
  pageInfo: PageInfo;
  edges: Array<{
    cursor: string;
    node: Product;
  }>;
}

export interface CollectionConnection {
  pageInfo: PageInfo;
  edges: Array<{
    cursor: string;
    node: Collection;
  }>;
}

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  attributes?: Array<{ key: string; value: string }>;
}

export interface CartLineUpdateInput {
  id: string;
  merchandiseId?: string;
  quantity?: number;
  attributes?: Array<{ key: string; value: string }>;
}

export interface UserError {
  field?: string[];
  message: string;
}

export interface CartMutationResponse {
  cart?: Cart;
  userErrors: UserError[];
}

export type ProductSortKey =
  | "TITLE"
  | "PRODUCT_TYPE"
  | "VENDOR"
  | "UPDATED_AT"
  | "CREATED_AT"
  | "BEST_SELLING"
  | "PRICE"
  | "ID"
  | "RELEVANCE";

export type SearchSortKey =
  | "RELEVANCE"
  | "PRICE"
  | "CREATED_AT"
  | "ID"
  | "PRODUCT_TYPE"
  | "TITLE"
  | "UPDATED_AT"
  | "VENDOR";

export type ProductCollectionSortKey =
  | "TITLE"
  | "PRICE"
  | "BEST_SELLING"
  | "CREATED"
  | "ID"
  | "MANUAL"
  | "COLLECTION_DEFAULT";

export interface SearchOptions {
  title?: string;
  vendor?: string;
  productType?: string;
  tag?: string;
  available?: boolean;
  price?: {
    min?: number;
    max?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Environment validation
const validateEnvironment = (): void => {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN) {
    throw new Error(
      "NEXT_PUBLIC_SHOPIFY_DOMAIN environment variable is required"
    );
  }
  if (!process.env.NEXT_PUBLIC_STOREFRONT_TOKEN) {
    throw new Error(
      "NEXT_PUBLIC_STOREFRONT_TOKEN environment variable is required"
    );
  }
};

// Validate environment on module load
validateEnvironment();

const SHOPIFY_STOREFRONT_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_STOREFRONT_TOKEN!;

// ========== CACHING AND RETRY LOGIC ==========
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ShopifyCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  // Create cache key from query and variables
  createKey(query: string, variables: Record<string, unknown>): string {
    return `${query.replace(/\s+/g, " ").trim()}_${JSON.stringify(variables)}`;
  }
}

// Global cache instance
const cache = new ShopifyCache();

// Custom error classes
export class ShopifyApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: ShopifyError[]
  ) {
    super(message);
    this.name = "ShopifyApiError";
  }
}

export class ShopifyNetworkError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = "ShopifyNetworkError";
  }
}

// Retry utility
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
  throw new Error("Retry logic failed");
}

// Base fetch function for Shopify API with caching, timeout, and retry
async function shopifyFetch<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
  options: {
    cache?: boolean;
    cacheTTL?: number;
    timeout?: number;
    maxRetries?: number;
  } = {}
): Promise<T> {
  const {
    cache: useCache = true,
    cacheTTL = 5 * 60 * 1000, // 5 minutes
    timeout = 10000, // 10 seconds
    maxRetries = 3,
  } = options;

  // Check cache first for GET-like operations (queries, not mutations)
  const isMutation = query.trim().toLowerCase().startsWith("mutation");
  const cacheKey = cache.createKey(query, variables);

  if (useCache && !isMutation) {
    const cachedData = cache.get<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  const fetchWithTimeout = async (): Promise<T> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(SHOPIFY_STOREFRONT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ShopifyApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data: ShopifyResponse<T> = await response.json();

      if (data.errors && data.errors.length > 0) {
        throw new ShopifyApiError(
          `GraphQL error: ${data.errors.map((e) => e.message).join(", ")}`,
          undefined,
          data.errors
        );
      }

      if (!data.data) {
        throw new ShopifyApiError("No data returned from Shopify API");
      }

      // Cache successful responses for non-mutations
      if (useCache && !isMutation) {
        cache.set(cacheKey, data.data, cacheTTL);
      }

      return data.data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ShopifyNetworkError(`Request timeout after ${timeout}ms`);
      }

      if (error instanceof ShopifyApiError) {
        throw error;
      }

      throw new ShopifyNetworkError(
        `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        error instanceof Error ? error : undefined
      );
    }
  };

  try {
    return await withRetry(fetchWithTimeout, maxRetries);
  } catch (error) {
    console.error("Shopify API Error:", error);
    throw error;
  }
}

// Cache management utilities
export const cacheUtils = {
  clear: () => cache.clear(),
  delete: (key: string) => cache.delete(key),

  // Clear product-related cache
  clearProductCache: () => {
    // In a real implementation, you might want to be more selective
    cache.clear();
  },

  // Clear cart-related cache
  clearCartCache: (cartId?: string) => {
    if (cartId) {
      // Clear specific cart cache entries
      cache.delete(`cartId:${cartId}`);
    } else {
      // Clear all cart-related cache
      cache.clear();
    }
  },
};

// ========== OPTIMIZED GRAPHQL FRAGMENTS ==========

// Core product fields - minimal for listings
const PRODUCT_CORE_FRAGMENT = `
  fragment ProductCoreFragment on Product {
    id
    handle
    title
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
`;

// Basic product fragment - for product cards/listings
const PRODUCT_BASIC_FRAGMENT = `
  fragment ProductBasicFragment on Product {
    ...ProductCoreFragment
    vendor
    tags
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
  ${PRODUCT_CORE_FRAGMENT}
`;

// Detailed product fragment - for product pages
const PRODUCT_DETAILED_FRAGMENT = `
  fragment ProductDetailedFragment on Product {
    ...ProductBasicFragment
    description
    descriptionHtml
    productType
    createdAt
    updatedAt
    publishedAt
    totalInventory
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    seo {
      title
      description
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
`;

// Optimized cart fragment
const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    createdAt
    updatedAt
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
    buyerIdentity {
      email
      phone
      countryCode
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
              product {
                id
                handle
                title
                featuredImage {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
    attributes {
      key
      value
    }
    discountCodes {
      applicable
      code
    }
  }
`;

// Minimal collection fragment
const COLLECTION_BASIC_FRAGMENT = `
  fragment CollectionBasicFragment on Collection {
    id
    handle
    title
    description
    updatedAt
    image {
      id
      url
      altText
      width
      height
    }
  }
`;

// ========== OPTIMIZED API FUNCTIONS ==========

// 1. Fetch all products with optimized fragment selection
export async function getAllProducts(
  first: number = 20,
  after: string | null = null,
  query: string | null = null,
  detailed: boolean = false
): Promise<ProductConnection> {
  const fragment = detailed
    ? PRODUCT_DETAILED_FRAGMENT
    : PRODUCT_BASIC_FRAGMENT;
  const fragmentName = detailed
    ? "ProductDetailedFragment"
    : "ProductBasicFragment";

  const GET_ALL_PRODUCTS = `
    query GetAllProducts($first: Int!, $after: String, $query: String) {
      products(first: $first, after: $after, query: $query, sortKey: CREATED_AT, reverse: true) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            ...${fragmentName}
          }
        }
      }
    }
    ${fragment}
  `;

  const variables: { first: number; after?: string; query?: string } = {
    first,
  };
  if (after) variables.after = after;
  if (query) variables.query = query;

  const data = await shopifyFetch<{ products: ProductConnection }>(
    GET_ALL_PRODUCTS,
    variables,
    { cacheTTL: detailed ? 2 * 60 * 1000 : 5 * 60 * 1000 } // Shorter cache for detailed
  );
  return data.products;
}

// 2. Fetch single product by handle (always detailed)
export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  const GET_PRODUCT_BY_HANDLE = `
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductDetailedFragment
      }
    }
    ${PRODUCT_DETAILED_FRAGMENT}
  `;

  const data = await shopifyFetch<{ product: Product | null }>(
    GET_PRODUCT_BY_HANDLE,
    { handle },
    { cacheTTL: 2 * 60 * 1000 } // 2 minutes for product details
  );
  return data.product;
}

// 2.5. Fetch product by slug (matches against slugified title)
export async function getProductBySlug(slug: string): Promise<Product | null> {
  // Import slugify function
  const slugify = (text: string) => {
    return text
      .toString()
      .normalize("NFKD")
      .replace(/[\u0300-\u036F]/g, "") // Remove accents
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  // Fetch all products and find matching slug
  const products = await getAllProducts(250, null, null, true); // Get up to 250 products

  const matchedProduct = products.edges.find(({ node }) => {
    return slugify(node.title) === slug;
  });

  return matchedProduct?.node || null;
}

// 3. Fetch single product by ID (always detailed)
export async function getProductById(id: string): Promise<Product | null> {
  const GET_PRODUCT_BY_ID = `
    query GetProductById($id: ID!) {
      product(id: $id) {
        ...ProductDetailedFragment
      }
    }
    ${PRODUCT_DETAILED_FRAGMENT}
  `;

  const data = await shopifyFetch<{ product: Product | null }>(
    GET_PRODUCT_BY_ID,
    { id },
    { cacheTTL: 2 * 60 * 1000 }
  );
  return data.product;
}

// 4. Search products with fragment selection
export async function searchProducts(
  searchTerm: string,
  first: number = 20,
  after: string | null = null,
  sortKey: SearchSortKey = "RELEVANCE",
  detailed: boolean = false
): Promise<SearchConnection> {
  const fragment = detailed
    ? PRODUCT_DETAILED_FRAGMENT
    : PRODUCT_BASIC_FRAGMENT;
  const fragmentName = detailed
    ? "ProductDetailedFragment"
    : "ProductBasicFragment";

  const SEARCH_PRODUCTS = `
    query SearchProducts($query: String!, $first: Int!, $after: String, $sortKey: SearchSortKeys) {
      search(query: $query, first: $first, after: $after, types: PRODUCT, sortKey: $sortKey) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            ... on Product {
              ...${fragmentName}
            }
          }
        }
      }
    }
    ${fragment}
  `;

  const variables: {
    query: string;
    first: number;
    sortKey: SearchSortKey;
    after?: string;
  } = {
    query: searchTerm,
    first,
    sortKey,
  };

  if (after) variables.after = after;

  const data = await shopifyFetch<{ search: SearchConnection }>(
    SEARCH_PRODUCTS,
    variables,
    { cache: false, cacheTTL: 0 } // No cache - always fetch fresh data
  );
  return data.search;
}

// ========== BATCHING UTILITY ==========
interface BatchRequest {
  id: string;
  query: string;
  variables: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (data: any) => void;
  reject: (error: Error) => void;
}

class RequestBatcher {
  private queue: BatchRequest[] = [];
  private timer: NodeJS.Timeout | null = null;
  private readonly maxBatchSize = 10;
  private readonly batchDelay = 50; // 50ms

  add<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      const request: BatchRequest = {
        id: Math.random().toString(36).substr(2, 9),
        query,
        variables,
        resolve,
        reject,
      };

      this.queue.push(request);

      if (this.queue.length >= this.maxBatchSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.batchDelay);
      }
    });
  }

  private async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length === 0) return;

    const batch = [...this.queue];
    this.queue = [];

    // For now, execute requests individually
    // In a real implementation, you might want to create a batch GraphQL query
    for (const request of batch) {
      try {
        const data = await shopifyFetch(request.query, request.variables);
        request.resolve(data);
      } catch (error) {
        request.reject(
          error instanceof Error ? error : new Error("Unknown error")
        );
      }
    }
  }
}

// Global batcher instance
const batcher = new RequestBatcher();

// Batched fetch function
export async function shopifyFetchBatched<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  return batcher.add<T>(query, variables);
}

// 5. Create a new cart (no caching for mutations)
export async function createCart(lines: CartLineInput[] = []): Promise<Cart> {
  const CREATE_CART = `
    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const input: { lines?: CartLineInput[] } = {};
  if (lines.length > 0) {
    input.lines = lines;
  }

  const data = await shopifyFetch<{ cartCreate: CartMutationResponse }>(
    CREATE_CART,
    { input },
    { cache: false } // Don't cache mutations
  );

  if (data.cartCreate.userErrors.length > 0) {
    throw new ShopifyApiError(
      `Cart creation failed: ${data.cartCreate.userErrors
        .map((e: UserError) => e.message)
        .join(", ")}`,
      undefined,
      data.cartCreate.userErrors.map((e) => ({ message: e.message }))
    );
  }

  return data.cartCreate.cart!;
}

// 6. Get cart by ID (with caching)
export async function getCart(cartId: string): Promise<Cart | null> {
  const GET_CART = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFragment
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{ cart: Cart | null }>(
    GET_CART,
    { cartId },
    { cacheTTL: 30 * 1000 } // 30 seconds for cart data
  );
  return data.cart;
}

// 7. Add lines to cart (no caching)
export async function addToCart(
  cartId: string,
  lines: CartLineInput[]
): Promise<Cart> {
  const ADD_TO_CART = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{ cartLinesAdd: CartMutationResponse }>(
    ADD_TO_CART,
    { cartId, lines },
    { cache: false }
  );

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new ShopifyApiError(
      `Add to cart failed: ${data.cartLinesAdd.userErrors
        .map((e: UserError) => e.message)
        .join(", ")}`,
      undefined,
      data.cartLinesAdd.userErrors.map((e) => ({ message: e.message }))
    );
  }

  // Clear cart cache after modification
  cacheUtils.clearCartCache(cartId);

  return data.cartLinesAdd.cart!;
}

// 8. Update cart lines (no caching)
export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<Cart> {
  const UPDATE_CART_LINES = `
    mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{ cartLinesUpdate: CartMutationResponse }>(
    UPDATE_CART_LINES,
    { cartId, lines },
    { cache: false }
  );

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new ShopifyApiError(
      `Cart update failed: ${data.cartLinesUpdate.userErrors
        .map((e: UserError) => e.message)
        .join(", ")}`,
      undefined,
      data.cartLinesUpdate.userErrors.map((e) => ({ message: e.message }))
    );
  }

  // Clear cart cache after modification
  cacheUtils.clearCartCache(cartId);

  return data.cartLinesUpdate.cart!;
}

// 9. Remove lines from cart (no caching)
export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const REMOVE_FROM_CART = `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{ cartLinesRemove: CartMutationResponse }>(
    REMOVE_FROM_CART,
    { cartId, lineIds },
    { cache: false }
  );

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new ShopifyApiError(
      `Remove from cart failed: ${data.cartLinesRemove.userErrors
        .map((e: UserError) => e.message)
        .join(", ")}`,
      undefined,
      data.cartLinesRemove.userErrors.map((e) => ({ message: e.message }))
    );
  }

  // Clear cart cache after modification
  cacheUtils.clearCartCache(cartId);

  return data.cartLinesRemove.cart!;
}

// 10. Apply discount code (no caching)
export async function applyDiscountCode(
  cartId: string,
  discountCodes: string[]
): Promise<Cart> {
  const APPLY_DISCOUNT = `
    mutation ApplyDiscountCode($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{
    cartDiscountCodesUpdate: CartMutationResponse;
  }>(APPLY_DISCOUNT, { cartId, discountCodes }, { cache: false });

  if (data.cartDiscountCodesUpdate.userErrors.length > 0) {
    throw new ShopifyApiError(
      `Discount application failed: ${data.cartDiscountCodesUpdate.userErrors
        .map((e: UserError) => e.message)
        .join(", ")}`,
      undefined,
      data.cartDiscountCodesUpdate.userErrors.map((e) => ({
        message: e.message,
      }))
    );
  }

  // Clear cart cache after modification
  cacheUtils.clearCartCache(cartId);

  return data.cartDiscountCodesUpdate.cart!;
}

// 11. Get product recommendations (with caching)
export async function getProductRecommendations(
  productId: string,
  first: number = 10
): Promise<Product[]> {
  const GET_PRODUCT_RECOMMENDATIONS = `
    query GetProductRecommendations($productId: ID!, $first: Int!) {
      productRecommendations(productId: $productId) {
        ...ProductBasicFragment
      }
    }
    ${PRODUCT_BASIC_FRAGMENT}
  `;

  const data = await shopifyFetch<{ productRecommendations: Product[] | null }>(
    GET_PRODUCT_RECOMMENDATIONS,
    { productId, first },
    { cacheTTL: 10 * 60 * 1000 } // 10 minutes for recommendations
  );
  return data.productRecommendations || [];
}

// 12. Get collections (optimized)
export async function getCollections(
  first: number = 20,
  after: string | null = null
): Promise<CollectionConnection> {
  const GET_COLLECTIONS = `
    query GetCollections($first: Int!, $after: String) {
      collections(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            ...CollectionBasicFragment
            products(first: 5) {
              edges {
                node {
                  ...ProductCoreFragment
                }
              }
            }
          }
        }
      }
    }
    ${COLLECTION_BASIC_FRAGMENT}
    ${PRODUCT_CORE_FRAGMENT}
  `;

  const variables: { first: number; after?: string } = { first };
  if (after) variables.after = after;

  const data = await shopifyFetch<{ collections: CollectionConnection }>(
    GET_COLLECTIONS,
    variables,
    { cacheTTL: 10 * 60 * 1000 } // 10 minutes for collections
  );
  return data.collections;
}

// 13. Get products from collection (optimized)
export async function getProductsByCollectionName(
  collectionName: string,
  first: number = 20,
  after: string | null = null,
  sortKey: ProductCollectionSortKey = "COLLECTION_DEFAULT",
  detailed: boolean = false
): Promise<{ collection: Collection; products: ProductConnection }> {
  const fragment = detailed
    ? PRODUCT_DETAILED_FRAGMENT
    : PRODUCT_BASIC_FRAGMENT;
  const fragmentName = detailed
    ? "ProductDetailedFragment"
    : "ProductBasicFragment";

  const GET_PRODUCTS_BY_COLLECTION_NAME = `
    query GetProductsByCollectionName($handle: String!, $first: Int!, $after: String, $sortKey: ProductCollectionSortKeys) {
      collection(handle: $handle) {
        ...CollectionBasicFragment
        products(first: $first, after: $after, sortKey: $sortKey) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            cursor
            node {
              ...${fragmentName}
            }
          }
        }
      }
    }
    ${COLLECTION_BASIC_FRAGMENT}
    ${fragment}
  `;

  // Convert collection name to handle format
  const handle = collectionName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  const variables: {
    handle: string;
    first: number;
    sortKey: ProductCollectionSortKey;
    after?: string;
  } = {
    handle,
    first,
    sortKey,
  };

  if (after) variables.after = after;

  const data = await shopifyFetch<{
    collection: (Collection & { products: ProductConnection }) | null;
  }>(
    GET_PRODUCTS_BY_COLLECTION_NAME,
    variables,
    { cache: false, cacheTTL: 0 } // No cache - always fetch fresh data
  );

  if (!data.collection) {
    throw new ShopifyApiError(`Collection "${collectionName}" not found`);
  }

  return {
    collection: {
      id: data.collection.id,
      handle: data.collection.handle,
      title: data.collection.title,
      description: data.collection.description,
      descriptionHtml: data.collection.descriptionHtml,
      updatedAt: data.collection.updatedAt,
      image: data.collection.image,
    },
    products: data.collection.products,
  };
}

// ========== BLOG API FUNCTIONS ==========

// Blog fragments
const ARTICLE_FRAGMENT = `
  fragment ArticleFragment on Article {
    id
    handle
    title
    content
    contentHtml
    excerpt
    excerptHtml
    publishedAt
    tags
    authorV2 {
      bio
      email
      firstName
      lastName
      name
    }
    blog {
      id
      handle
      title
    }
    image {
      id
      url
      altText
      width
      height
    }
    seo {
      title
      description
    }
  }
`;

const BLOG_FRAGMENT = `
  fragment BlogFragment on Blog {
    id
    handle
    title
    seo {
      title
      description
    }
  }
`;

// 14. Get all blogs
export async function getAllBlogs(first: number = 10): Promise<Blog[]> {
  const GET_BLOGS = `
    query GetBlogs($first: Int!) {
      blogs(first: $first) {
        edges {
          node {
            ...BlogFragment
            articles(first: 0) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
    ${BLOG_FRAGMENT}
  `;

  const data = await shopifyFetch<{
    blogs: { edges: Array<{ node: Blog }> };
  }>(
    GET_BLOGS,
    { first },
    { cache: false, cacheTTL: 0 } // No cache - always fetch fresh data
  );

  return data.blogs.edges.map(({ node }) => node);
}

// 15. Get blog by handle
export async function getBlogByHandle(
  handle: string,
  articlesFirst: number = 10
): Promise<Blog | null> {
  const GET_BLOG = `
    query GetBlog($handle: String!, $articlesFirst: Int!) {
      blog(handle: $handle) {
        ...BlogFragment
        articles(first: $articlesFirst, sortKey: PUBLISHED_AT, reverse: true) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            cursor
            node {
              ...ArticleFragment
            }
          }
        }
      }
    }
    ${BLOG_FRAGMENT}
    ${ARTICLE_FRAGMENT}
  `;

  const data = await shopifyFetch<{ blog: Blog | null }>(
    GET_BLOG,
    { handle, articlesFirst },
    { cache: false, cacheTTL: 0 } // No cache - always fetch fresh data
  );

  return data.blog;
}

// 16. Get article by handle
export async function getArticleByHandle(
  blogHandle: string,
  articleHandle: string
): Promise<Article | null> {
  const GET_ARTICLE = `
    query GetArticle($blogHandle: String!, $articleHandle: String!) {
      blog(handle: $blogHandle) {
        articleByHandle(handle: $articleHandle) {
          ...ArticleFragment
        }
      }
    }
    ${ARTICLE_FRAGMENT}
  `;

  const data = await shopifyFetch<{
    blog: { articleByHandle: Article | null } | null;
  }>(
    GET_ARTICLE,
    { blogHandle, articleHandle },
    { cache: false, cacheTTL: 0 } // No cache - always fetch fresh data
  );

  return data.blog?.articleByHandle || null;
}

// 17. Get all articles from a blog
export async function getArticlesByBlog(
  blogHandle: string,
  first: number = 20,
  after?: string,
  query?: string
): Promise<ArticleConnection> {
  const GET_ARTICLES = `
    query GetArticles($blogHandle: String!, $first: Int!, $after: String, $query: String) {
      blog(handle: $blogHandle) {
        articles(first: $first, after: $after, query: $query, sortKey: PUBLISHED_AT, reverse: true) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            cursor
            node {
              ...ArticleFragment
            }
          }
        }
      }
    }
    ${ARTICLE_FRAGMENT}
  `;

  const variables: {
    blogHandle: string;
    first: number;
    after?: string;
    query?: string;
  } = {
    blogHandle,
    first,
  };

  if (after) variables.after = after;
  if (query) variables.query = query;

  const data = await shopifyFetch<{
    blog: { articles: ArticleConnection } | null;
  }>(
    GET_ARTICLES,
    variables,
    { cache: false, cacheTTL: 0 } // No cache - always fetch fresh data
  );

  if (!data.blog) {
    throw new ShopifyApiError(`Blog "${blogHandle}" not found`);
  }

  return data.blog.articles;
}

// 18. Get articles by tags
export async function getArticlesByTags(
  blogHandle: string,
  tags: string[],
  first: number = 20
): Promise<Article[]> {
  const tagQuery = tags.map((tag) => `tag:${tag}`).join(" OR ");

  const articles = await getArticlesByBlog(
    blogHandle,
    first,
    undefined,
    tagQuery
  );

  return articles.edges.map(({ node }) => node);
}

// 19. Get latest articles (across all blogs)
export async function getLatestArticles(
  first: number = 10
): Promise<Article[]> {
  const GET_LATEST_ARTICLES = `
    query GetLatestArticles($first: Int!) {
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            ...ArticleFragment
          }
        }
      }
    }
    ${ARTICLE_FRAGMENT}
  `;

  const data = await shopifyFetch<{
    articles: { edges: Array<{ node: Article }> };
  }>(
    GET_LATEST_ARTICLES,
    { first },
    { cache: false, cacheTTL: 0 } // No cache - always fetch fresh data
  );

  return data.articles.edges.map(({ node }) => node);
}

// ========== ENHANCED HELPER FUNCTIONS ==========

// Helper functions for cart management
export const cartHelpers = {
  // Create cart line item format
  createCartLine: (
    variantId: string,
    quantity: number = 1,
    attributes: Array<{ key: string; value: string }> = []
  ): CartLineInput => ({
    merchandiseId: variantId,
    quantity,
    attributes,
  }),

  // Format cart line for updates
  createCartLineUpdate: (
    lineId: string,
    variantId: string,
    quantity: number,
    attributes: Array<{ key: string; value: string }> = []
  ): CartLineUpdateInput => ({
    id: lineId,
    merchandiseId: variantId,
    quantity,
    attributes,
  }),

  // Calculate cart totals
  calculateCartTotals: (cart: Cart | null) => {
    if (!cart) return null;

    return {
      itemCount: cart.totalQuantity,
      subtotal: cart.cost.subtotalAmount,
      total: cart.cost.totalAmount,
      tax: cart.cost.totalTaxAmount,
      duty: cart.cost.totalDutyAmount,
    };
  },

  // Get cart line items in a more usable format
  formatCartLines: (cart: Cart | null) => {
    if (!cart?.lines?.edges) return [];

    return cart.lines.edges.map(({ node }: { node: CartLine }) => ({
      id: node.id,
      quantity: node.quantity,
      cost: node.cost.totalAmount,
      variant: {
        id: node.merchandise.id,
        title: node.merchandise.title,
        price: node.merchandise.price,
        selectedOptions: node.merchandise.selectedOptions,
        image: node.merchandise.product.featuredImage,
      },
      product: {
        id: node.merchandise.product.id,
        handle: node.merchandise.product.handle,
        title: node.merchandise.product.title,
      },
    }));
  },

  // Check if cart is empty
  isEmpty: (cart: Cart | null): boolean => {
    return !cart || cart.totalQuantity === 0;
  },

  // Get cart item count
  getItemCount: (cart: Cart | null): number => {
    return cart?.totalQuantity || 0;
  },

  // Find line item by variant ID
  findLineByVariant: (cart: Cart | null, variantId: string) => {
    if (!cart?.lines?.edges) return null;

    return (
      cart.lines.edges.find(({ node }) => node.merchandise.id === variantId)
        ?.node || null
    );
  },
};

// Search helpers
export const searchHelpers = {
  // Build advanced search queries
  buildProductQuery: (options: SearchOptions): string => {
    const {
      title,
      vendor,
      productType,
      tag,
      available,
      price,
      createdAt,
      updatedAt,
    } = options;

    const queryParts: string[] = [];

    if (title) queryParts.push(`title:*${title}*`);
    if (vendor) queryParts.push(`vendor:${vendor}`);
    if (productType) queryParts.push(`product_type:${productType}`);
    if (tag) queryParts.push(`tag:${tag}`);
    if (available !== undefined) queryParts.push(`available:${available}`);
    if (price) {
      if (price.min) queryParts.push(`variants.price:>=${price.min}`);
      if (price.max) queryParts.push(`variants.price:<=${price.max}`);
    }
    if (createdAt) queryParts.push(`created_at:${createdAt}`);
    if (updatedAt) queryParts.push(`updated_at:${updatedAt}`);

    return queryParts.join(" AND ");
  },

  // Search sort options
  sortKeys: {
    RELEVANCE: "RELEVANCE" as const,
    PRICE: "PRICE" as const,
    CREATED_AT: "CREATED_AT" as const,
    ID: "ID" as const,
    PRODUCT_TYPE: "PRODUCT_TYPE" as const,
    TITLE: "TITLE" as const,
    UPDATED_AT: "UPDATED_AT" as const,
    VENDOR: "VENDOR" as const,
  },

  // Collection sort options
  collectionSortKeys: {
    TITLE: "TITLE" as const,
    PRICE: "PRICE" as const,
    BEST_SELLING: "BEST_SELLING" as const,
    CREATED: "CREATED" as const,
    ID: "ID" as const,
    MANUAL: "MANUAL" as const,
    COLLECTION_DEFAULT: "COLLECTION_DEFAULT" as const,
  },
};

// Product helpers
export const productHelpers = {
  // Format price for display
  formatPrice: (money: Money): string => {
    const amount = parseFloat(money.amount);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: money.currencyCode,
    }).format(amount);
  },

  // Check if product is on sale
  isOnSale: (product: Product): boolean => {
    if (!product.compareAtPriceRange?.minVariantPrice) return false;

    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    const compareAtPrice = parseFloat(
      product.compareAtPriceRange.minVariantPrice.amount
    );

    return compareAtPrice > price;
  },

  // Get discount percentage
  getDiscountPercentage: (product: Product): number | null => {
    if (!productHelpers.isOnSale(product)) return null;

    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    const compareAtPrice = parseFloat(
      product.compareAtPriceRange!.minVariantPrice.amount
    );

    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  },

  // Get first available variant
  getFirstAvailableVariant: (product: Product): ProductVariant | null => {
    return (
      product.variants.edges.find(({ node }) => node.availableForSale)?.node ||
      null
    );
  },

  // Check if product has multiple variants
  hasMultipleVariants: (product: Product): boolean => {
    return product.variants.edges.length > 1;
  },
};

// Blog helper functions
export const blogHelpers = {
  // Format article excerpt
  formatExcerpt: (article: Article, maxLength: number = 200): string => {
    const excerpt = article.excerpt || article.content;
    if (excerpt.length <= maxLength) return excerpt;
    return excerpt.substring(0, maxLength).trim() + "...";
  },

  // Get article reading time (words per minute)
  getReadingTime: (article: Article, wordsPerMinute: number = 200): number => {
    const wordCount = article.content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  },

  // Get article author name
  getAuthorName: (article: Article): string => {
    return article.authorV2?.name || article.author?.name || "Anonymous";
  },

  // Format published date
  formatPublishedDate: (article: Article, locale: string = "en-US"): string => {
    const date = new Date(article.publishedAt);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  // Get relative time (e.g., "2 days ago")
  getRelativeTime: (article: Article): string => {
    const date = new Date(article.publishedAt);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  },

  // Check if article is recent
  isRecent: (article: Article, daysThreshold: number = 7): boolean => {
    const date = new Date(article.publishedAt);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffInDays <= daysThreshold;
  },

  // Filter articles by tag
  filterByTag: (articles: Article[], tag: string): Article[] => {
    return articles.filter((article) =>
      article.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  },

  // Get unique tags from articles
  getUniqueTags: (articles: Article[]): string[] => {
    const tags = new Set<string>();
    articles.forEach((article) => {
      article.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  },

  // Get related articles (by tags)
  getRelatedArticles: (
    currentArticle: Article,
    allArticles: Article[],
    limit: number = 3
  ): Article[] => {
    const currentTags = new Set(
      currentArticle.tags.map((t) => t.toLowerCase())
    );

    return allArticles
      .filter((article) => article.id !== currentArticle.id)
      .map((article) => {
        const matchingTags = article.tags.filter((tag) =>
          currentTags.has(tag.toLowerCase())
        ).length;
        return { article, matchingTags };
      })
      .filter(({ matchingTags }) => matchingTags > 0)
      .sort((a, b) => b.matchingTags - a.matchingTags)
      .slice(0, limit)
      .map(({ article }) => article);
  },

  // Strip HTML from content
  stripHtml: (html: string): string => {
    return html.replace(/<[^>]*>/g, "").trim();
  },

  // Get article URL
  getArticleUrl: (article: Article): string => {
    return `/blogs/${article.blog.handle}/${article.handle}`;
  },

  // Get blog URL
  getBlogUrl: (blogHandle: string): string => {
    return `/blogs/${blogHandle}`;
  },
};

// Performance monitoring
export const performanceUtils = {
  // Monitor API performance
  measureApiCall: async <T>(
    name: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await apiCall();
      // console.log(`[Shopify API] ${name}: ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(
        `[Shopify API] ${name} failed after ${duration.toFixed(2)}ms:`,
        error
      );
      throw error;
    }
  },

  // Batch performance measurement
  measureBatch: async <T>(
    name: string,
    operations: Array<() => Promise<T>>
  ): Promise<T[]> => {
    const start = performance.now();
    try {
      const results = await Promise.all(operations.map((op) => op()));
      // console.log(
      //   `[Shopify API Batch] ${name}: ${duration.toFixed(2)}ms for ${
      //     operations.length
      //   } operations`
      // );
      return results;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(
        `[Shopify API Batch] ${name} failed after ${duration.toFixed(2)}ms:`,
        error
      );
      throw error;
    }
  },
};

// Main export object with all functions
const shopifyClient = {
  // Core API functions
  getAllProducts,
  getProductByHandle,
  getProductBySlug,
  getProductById,
  searchProducts,
  createCart,
  getCart,
  addToCart,
  updateCartLines,
  removeFromCart,
  applyDiscountCode,
  getProductRecommendations,
  getCollections,
  getProductsByCollectionName,

  // Blog API functions
  getAllBlogs,
  getBlogByHandle,
  getArticleByHandle,
  getArticlesByBlog,
  getArticlesByTags,
  getLatestArticles,

  // Batched functions
  shopifyFetchBatched,

  // Helper objects
  cartHelpers,
  searchHelpers,
  productHelpers,
  blogHelpers,
  performanceUtils,
  cacheUtils,

  // Error classes
  ShopifyApiError,
  ShopifyNetworkError,

  // Types (re-exported for convenience)
  types: {
    // These would be type-only exports in a real implementation
  },
};

export default shopifyClient;
