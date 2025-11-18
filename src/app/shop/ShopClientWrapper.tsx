"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ShopClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if there's a hash in the URL on mount or when searchParams change
    const hash = window.location.hash.substring(1); // Remove the # symbol
    if (hash) {
      // Wait for content to render and then scroll
      const scrollToSection = () => {
        const element = document.getElementById(hash);
        if (element) {
          // Use setTimeout to ensure DOM is fully rendered
          setTimeout(() => {
            element.scrollIntoView({ 
              behavior: "smooth", 
              block: "start",
              inline: "nearest"
            });
          }, 300);
        }
      };

      // Try immediately and also after a delay for slower renders
      scrollToSection();
      const timer = setTimeout(scrollToSection, 500);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return <>{children}</>;
}
