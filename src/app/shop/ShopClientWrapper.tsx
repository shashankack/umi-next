"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ShopClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if there's a hash in the URL on mount
    const hash = window.location.hash.substring(1); // Remove the # symbol
    if (hash) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [searchParams]);

  return <>{children}</>;
}
