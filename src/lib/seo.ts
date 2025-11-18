/**
 * SEO utility functions for generating canonical URLs and metadata
 */

const BASE_URL = "https://umimatchashop.com";

/**
 * Generate canonical URL for a given path
 * @param path - The path without leading slash (e.g., "shop" or "shop/product-slug")
 * @returns Full canonical URL
 */
export function getCanonicalUrl(path: string = ""): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  
  // Remove trailing slash if present
  const finalPath = cleanPath.endsWith("/") ? cleanPath.slice(0, -1) : cleanPath;
  
  return `${BASE_URL}${finalPath ? `/${finalPath}` : ""}`;
}

/**
 * Generate Open Graph image URL for a page
 * @param imagePath - Path to image in public folder (e.g., "/images/og/home.jpg")
 * @returns Full URL to OG image
 */
export function getOgImageUrl(imagePath: string): string {
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `${BASE_URL}/${cleanPath}`;
}

/**
 * Common metadata defaults for Umi Matcha
 */
export const seoDefaults = {
  siteName: "Umi Matcha",
  twitterHandle: "@umimatchashop",
  defaultImage: "/images/og/default.jpg",
  locale: "en_US",
  type: "website",
};
