import { Metadata } from "next";
import { getProductBySlug } from "@/lib/shopify";
import {
  extractPageTitle,
  extractPageDescription,
  extractPageKeywords,
} from "@/lib/htmlParsers";
import { notFound } from "next/navigation";
import ProductInternalClient from "./ProductInternalClient";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const pageTitle = extractPageTitle(product.descriptionHtml) || product.title;
  const pageDescription =
    extractPageDescription(product.descriptionHtml) || product.description;
  const pageKeywords = extractPageKeywords(product.descriptionHtml);

  const image = product.featuredImage?.url || product.images.edges[0]?.node.url;
  const price = product.priceRange.minVariantPrice;

  return {
    title: `${pageTitle} | Umi Matcha`,
    description: pageDescription,
    keywords: pageKeywords?.split(",").map((k) => k.trim()) || [
      product.title,
      "matcha",
      "Umi Matcha",
    ],
    openGraph: {
      title: pageTitle,
      description: pageDescription,
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

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  // console.log("Fetching product with slug:", slug);

  const product = await getProductBySlug(slug);
  // console.log("Product fetched:", product ? product.title : "Not found");

  if (!product) {
    notFound();
  }

  return <ProductInternalClient product={product} />;
}
