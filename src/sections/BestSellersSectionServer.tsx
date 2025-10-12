import React from "react";
import { fetchBestSellers } from "../lib/fetchCollection";
import BestSellersClient from "./BestSellersClient";

/**
 * Server Component version - Data fetching happens on the server
 * This provides better SEO, faster initial load, and no loading states
 */
const BestSellersSection = async () => {
  // Fetch data on the server during SSR/SSG
  const { matchaProducts, matchaWareProducts, collectionInfo } =
    await fetchBestSellers();

  return (
    <BestSellersClient
      matchaProducts={matchaProducts}
      matchaWareProducts={matchaWareProducts}
      collectionInfo={collectionInfo}
    />
  );
};

export default BestSellersSection;
