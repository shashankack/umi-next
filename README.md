# Umi Matcha – Next.js E-commerce

A modern, SEO-optimized e-commerce site for Umi Matcha, built with Next.js 15, TypeScript, and Shopify Storefront API.

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - `NEXT_PUBLIC_SHOPIFY_DOMAIN`
   - `NEXT_PUBLIC_STOREFRONT_TOKEN`

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Structure

```
src/
  app/
    layout.tsx           # Root layout, global metadata, SEO, structured data
    sitemap.ts           # Dynamic sitemap (static + Shopify products/blogs)
    [pages]/             # Home, About, Shop, Brewing, Farm-to-Foam, Contact, Blogs
    shop/[slug]/         # Dynamic product pages
    blogs/[blogHandle]/[articleHandle]/ # Dynamic blog articles
  components/            # UI components (Navbar, Footer, ProductCard, etc.)
  context/               # React context (Cart)
  lib/
    shopify.ts           # Shopify Storefront API integration
    structuredData.ts    # JSON-LD schema generators
    fetchCollection.ts   # Collection fetching helpers
public/
  robots.txt             # SEO/crawler config
  sitemap.xml            # (Generated at runtime)
  images/, fonts/, videos/
docs/
  SEO_AUDIT_REPORT.md    # Full SEO audit and recommendations
  SEO_IMPLEMENTATION_SUMMARY.md
  SEO_ACTION_ITEMS.md
```

---

## 🛒 Features

- **Shopify Integration:** Real-time product, collection, and blog data via Storefront API.
- **Dynamic Routing:** Products and blog articles are statically generated for SEO.
- **SEO & Metadata:** 
  - Unique titles, descriptions, and keywords per page
  - Open Graph & Twitter Card support
  - JSON-LD structured data (Organization, Product, Breadcrumb, Website)
- **Crawlability:** 
  - `robots.txt` and dynamic `sitemap.xml` (auto-includes all products/blogs)
- **Performance:** 
  - Image optimization (WebP/AVIF)
  - Security headers
  - Mobile-first, responsive design
- **Accessibility:** 
  - Alt tags, ARIA labels, semantic HTML

---

## 🧑‍💻 Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm start` – Start production server
- `npm run lint` – Lint code

---

## 🔍 SEO & Deployment Checklist

- [x] All pages have unique, optimized metadata
- [x] robots.txt and sitemap.xml are production-ready
- [x] Structured data for rich results
- [x] Shopify products/blogs auto-included in sitemap
- [x] Mobile and accessibility best practices
- [ ] Update all hardcoded domain references before launch
- [ ] Set up Google Search Console & Analytics

See `/docs/SEO_AUDIT_REPORT.md` and `/docs/SEO_IMPLEMENTATION_SUMMARY.md` for full details.

---

## 📄 robots.txt

```txt
User-agent: *
Allow: /

Sitemap: https://www.umimatchashop.com/sitemap.xml
```

---

## 📚 Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [SEO Best Practices](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

---

## 📝 License

Private project for Umi Matcha.
