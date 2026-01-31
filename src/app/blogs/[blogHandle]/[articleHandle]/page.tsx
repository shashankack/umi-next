import { notFound } from "next/navigation";
import {
  getBlogByHandle,
  getArticleByHandle,
  blogHelpers,
} from "@/lib/shopify";
import type { Article } from "@/lib/shopify";
import type { Metadata } from "next";
import ArticleClient from "./ArticleClient";
import { getCanonicalUrl } from "@/lib/seo";
import { getArticleSchema } from "@/lib/blogSchemas";

interface ArticlePageProps {
  params: Promise<{
    blogHandle: string;
    articleHandle: string;
  }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { blogHandle, articleHandle } = await params;
  try {
    const article = await getArticleByHandle(
      blogHandle,
      articleHandle
    );

    if (!article) {
      return {
        title: "Article Not Found",
      };
    }

    const excerpt = article.excerpt
      ? blogHelpers.stripHtml(article.excerpt)
      : blogHelpers.formatExcerpt(article, 160);

    return {
      title: article.seo?.title || article.title,
      description: article.seo?.description || excerpt,
      keywords: article.tags,
      alternates: {
        canonical: getCanonicalUrl(`blogs/${blogHandle}/${articleHandle}`),
      },
      openGraph: {
        title: article.title,
        description: excerpt,
        url: getCanonicalUrl(`blogs/${blogHandle}/${articleHandle}`),
        siteName: "Umi Matcha",
        locale: "en_US",
        type: "article",
        publishedTime: article.publishedAt,
        authors: [blogHelpers.getAuthorName(article)],
        tags: article.tags,
        images: article.image
          ? [
              {
                url: article.image.url,
                width: article.image.width,
                height: article.image.height,
                alt: article.image.altText || article.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: excerpt,
        images: article.image ? [article.image.url] : undefined,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Article",
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { blogHandle, articleHandle } = await params;
  let article;
  let relatedArticles: Article[] = [];

  try {
    article = await getArticleByHandle(blogHandle, articleHandle);

    if (!article) {
      notFound();
    }

    // Get related articles from the same blog
    const blog = await getBlogByHandle(blogHandle, 20);
    if (blog) {
      const allArticles = blog.articles.edges.map(({ node }) => node);
      relatedArticles = blogHelpers.getRelatedArticles(article, allArticles, 3);
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    notFound();
  }

  // Get JSON-LD structured data for this article (if configured)
  const schemaData = getArticleSchema(articleHandle, article);

  return (
    <>
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      <ArticleClient article={article} relatedArticles={relatedArticles} />
    </>
  );
}
