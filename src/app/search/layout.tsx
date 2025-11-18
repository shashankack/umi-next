import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Search Products | Umi Matcha",
  description:
    "Search our collection of premium ceremonial matcha, accessories, and more. Find exactly what you're looking for from Umi Matcha.",
  keywords: [
    "search matcha products",
    "find matcha",
    "matcha search",
    "browse matcha",
    "Umi Matcha products",
  ],
  alternates: {
    canonical: getCanonicalUrl("search"),
  },
  openGraph: {
    title: "Search Products | Umi Matcha",
    description:
      "Search our collection of premium ceremonial matcha and accessories.",
    url: getCanonicalUrl("search"),
    siteName: "Umi Matcha",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: false, // Prevent indexing of search results pages
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
