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
    '/faq',
    '/policies/privacy-policy',
    '/policies/terms-of-service',
    '/policies/refund-policy',
    '/policies/shipping-policy',
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
    productRoutes = productsData.edges
      .map(({ node: product }) => {
        const lastModified = product.updatedAt ? new Date(product.updatedAt) : new Date();
        // Validate the date is valid
        if (isNaN(lastModified.getTime())) {
          return null;
        }
        return {
          url: `${baseUrl}/shop/${slugify(product.title)}`,
          lastModified,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };
      })
      .filter((route): route is NonNullable<typeof route> => route !== null);
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Fetch all blog articles dynamically
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await getLatestArticles(100); // Get up to 100 articles
    blogRoutes = articles
      .map((article) => {
        const lastModified = article.publishedAt ? new Date(article.publishedAt) : new Date();
        // Validate the date is valid
        if (isNaN(lastModified.getTime())) {
          return null;
        }
        return {
          url: `${baseUrl}/blogs/${article.blog.handle}/${article.handle}`,
          lastModified,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        };
      })
      .filter((route): route is NonNullable<typeof route> => route !== null);
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
  }

  // Combine all routes
  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
