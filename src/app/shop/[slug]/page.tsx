import { Metadata } from "next";
import { getProductByHandle, getAllProducts } from "@/lib/shopify";
import { notFound } from "next/navigation";
import ProductInternalClient from "./ProductInternalClient";
import { getCanonicalUrl } from "@/lib/seo";

// Revalidate every 60 seconds so product changes from Shopify appear promptly
export const revalidate = 60;

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductByHandle(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  // Use Shopify SEO fields (set in product admin → SEO section)
  const pageTitle = product.seo?.title || product.title;
  const pageDescription = product.seo?.description || product.description;
  // Keywords: add tags prefixed with "kw:" in Shopify admin (e.g. "kw:ceremonial matcha")
  // This keeps functional tags (bestseller, limited) separate from SEO keywords
  const keywords = product.tags
    .filter((tag) => tag.toLowerCase().startsWith("kw:"))
    .map((tag) => tag.slice(3).trim())
    .filter(Boolean);
  if (keywords.length === 0) keywords.push(product.title, "matcha", "Umi Matcha");

  const image = product.featuredImage?.url || product.images.edges[0]?.node.url;
  const price = product.priceRange.minVariantPrice;
  const titleWithBrand = /\bumi\s*matcha\b/i.test(pageTitle)
    ? pageTitle
    : `${pageTitle} | Umi Matcha`;

  return {
    // Use absolute title so root layout template does not append another suffix.
    title: { absolute: titleWithBrand },
    description: pageDescription,
    keywords,
    alternates: {
      canonical: getCanonicalUrl(`shop/${slug}`),
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: getCanonicalUrl(`shop/${slug}`),
      siteName: "Umi Matcha",
      locale: "en_US",
      images: image ? [{ url: image }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: image ? [image] : [],
    },
    // Product schema for SEO
    other: {
      "product:price:amount": price.amount,
      "product:price:currency": price.currencyCode,
      "og:type": "product",
      "product:availability": product.availableForSale
        ? "in stock"
        : "out of stock",
    },
  };
}

// Pre-generate pages for all products at build time using their Shopify URL handles
export async function generateStaticParams() {
  try {
    const productsData = await getAllProducts(250);
    return productsData.edges.map(({ node }) => ({ slug: node.handle }));
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProductByHandle(slug);

  if (!product) {
    notFound();
  }

  return <ProductInternalClient product={product} />;
}
