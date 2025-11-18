import { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/seo";
import FarmToFoamClient from "./FarmToFoamClient";

export const metadata: Metadata = {
  title: "Farm to Foam - Our Matcha Journey",
  description: "Discover the journey of Umi Matcha from organic farms in Wazuka, Japan to your cup. Learn about our 300+ year old certified organic tea farms and traditional cultivation methods.",
  keywords: [
    "organic matcha farm",
    "Wazuka matcha",
    "Japanese tea farm",
    "matcha cultivation",
    "organic tea farming",
    "ceremonial matcha production",
    "farm to table matcha",
  ],
  alternates: {
    canonical: getCanonicalUrl("farm-to-foam"),
  },
  openGraph: {
    title: "Farm to Foam - Our Matcha Journey | Umi Matcha",
    description: "Discover the journey of Umi Matcha from organic farms in Wazuka, Japan to your cup.",
    url: getCanonicalUrl("farm-to-foam"),
    siteName: "Umi Matcha",
    locale: "en_US",
    type: "website",
  },
};

export default function FarmToFoamPage() {
  return <FarmToFoamClient />;
}
