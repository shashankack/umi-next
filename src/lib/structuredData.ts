export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Umi Matcha',
    url: 'https://umimatchashop.com',
    logo: 'https://umimatchashop.com/images/icons/pink_logo.png',
    description: 'Premium organic matcha from 300+ year old farms in Wazuka, Japan. Kinder rituals that fill your cup.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9568480048',
      contactType: 'Customer Service',
      email: 'umimatchaclub@gmail.com',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.instagram.com/umimatchaclub',
      'https://wa.me/9568480048',
      'https://pin.it/5YQInpBIg',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Umi Matcha',
    url: 'https://umimatchashop.com',
    description: 'Premium organic matcha from Japan. Shop ceremonial grade matcha, accessories, and bundles.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://umimatchashop.com/shop?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateProductSchema(product: any) {
  const price = product.priceRange?.minVariantPrice;
  const image = product.featuredImage?.url || product.images?.edges?.[0]?.node?.url;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: image,
    brand: {
      '@type': 'Brand',
      name: 'Umi Matcha',
    },
    offers: {
      '@type': 'Offer',
      price: price?.amount,
      priceCurrency: price?.currencyCode || 'INR',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://umimatchashop.com/shop/${product.handle}`,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleSchema(article: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt || article.description,
    image: article.image?.url,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Umi Matcha',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Umi Matcha',
      logo: {
        '@type': 'ImageObject',
        url: 'https://umimatchashop.com/images/icons/pink_logo.png',
      },
    },
  };
}
