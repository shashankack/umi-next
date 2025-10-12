import { MetadataRoute } from 'next';
import { getAllProducts, getLatestArticles } from '@/lib/shopify';
import { slugify } from '@/lib/slug';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://umimatchashop.com';

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/shop',
    '/brewing',
    '/farm-to-foam',
    '/contact',
    '/blogs',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/shop' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : route === '/shop' ? 0.9 : 0.8,
  }));

  // Fetch all products dynamically
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const productsData = await getAllProducts(250, null, null, false); // Get up to 250 products
    productRoutes = productsData.edges.map(({ node: product }) => ({
      url: `${baseUrl}/shop/${slugify(product.title)}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Fetch all blog articles dynamically
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await getLatestArticles(100); // Get up to 100 articles
    blogRoutes = articles.map((article) => ({
      url: `${baseUrl}/blogs/${article.blog.handle}/${article.handle}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
  }

  // Combine all routes
  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
