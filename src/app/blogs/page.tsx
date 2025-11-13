
import { getLatestArticles } from "@/lib/shopify";
import type { Article } from "@/lib/shopify";
import BlogsClient from "./BlogsClient";

// Force dynamic rendering and always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Matcha Stories - Blog | UMI Matcha",
  description:
    "Discover the world of matcha through curated stories, recipes, and cultural insights. Explore our collection of articles about matcha tea, wellness, and lifestyle.",
  keywords: [
    "matcha blog",
    "matcha stories",
    "matcha recipes",
    "matcha wellness",
    "matcha culture",
    "green tea blog",
    "matcha lifestyle",
    "tea ceremonies",
    "matcha health benefits",
  ],
  openGraph: {
    title: "Matcha Stories - Blog | UMI Matcha",
    description:
      "Discover the world of matcha through curated stories, recipes, and cultural insights.",
    type: "website",
    images: [
      {
        url: "/images/og/blogs.png",
        width: 1200,
        height: 630,
        alt: "UMI Matcha Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matcha Stories - Blog | UMI Matcha",
    description:
      "Discover the world of matcha through curated stories, recipes, and cultural insights.",
    images: ["/images/og/blogs.png"],
  },
};

export default async function BlogsPage() {
  let articles: Article[] = [];
  let error = null;

  try {
    // Always fetch fresh articles, no cache
    articles = await getLatestArticles(20);
  } catch (err) {
    console.error("Error fetching blog articles:", err);
    error = "Failed to load articles. Please try again later.";
  }

  // Get unique blog handles for categories
  const categories = ["All"];
  const blogSet = new Set<string>();
  articles.forEach((article) => {
    if (article.blog?.handle) {
      blogSet.add(article.blog.handle);
    }
  });
  categories.push(...Array.from(blogSet));

  return (
    <BlogsClient
      initialArticles={articles}
      categories={categories}
      error={error}
    />
  );
}
