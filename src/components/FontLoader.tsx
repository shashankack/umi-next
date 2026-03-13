"use client";
import { useEffect } from "react";

/**
 * FontLoader component ensures all custom fonts are loaded before rendering
 * This prevents FOUT (Flash of Unstyled Text) and layout shifts
 */
export default function FontLoader({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!document.fonts) {
      return;
    }

    // Load fonts with timeout fallback
    const loadFonts = async () => {
      try {
        // Wait for document.fonts.ready with timeout
        const timeoutPromise = new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 3000); // 3 second max wait
        });

        const fontsReadyPromise = document.fonts.ready.then(() => {
          // Verify critical fonts are loaded
          const bricolageLoaded = document.fonts.check('1em Bricolage');
          const glikerLoaded = document.fonts.check('1em Gliker');
          
          if (bricolageLoaded && glikerLoaded) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('Critical fonts not loaded'));
        });

        // Race between fonts loading and timeout
        await Promise.race([fontsReadyPromise, timeoutPromise]);
      } catch {
        // Fallback: display content even if fonts fail to load
        console.warn("Font loading timeout, displaying content with fallback fonts");
      }
    };

    void loadFonts();
  }, []);

  // For SSR and initial render, always show content
  // The font-display: optional will handle the font swapping
  return <>{children}</>;
}
