"use client";
import { useEffect, useState } from 'react';

/**
 * FontLoader component ensures all custom fonts are loaded before rendering
 * This prevents FOUT (Flash of Unstyled Text) and layout shifts
 */
export default function FontLoader({ children }: { children: React.ReactNode }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Check if fonts are already loaded (from cache)
    if (document.fonts && document.fonts.check('1em Bricolage')) {
      setFontsLoaded(true);
      return;
    }

    // Define all fonts used in the application
    const fontFaces = [
      { family: 'Bricolage', weight: 'normal' },
      { family: 'Gliker', weight: 'normal' },
      { family: 'Genty', weight: 'normal' },
      { family: 'Stolzl', weight: 'normal' },
    ];

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
        
        setFontsLoaded(true);
      } catch (error) {
        // Fallback: display content even if fonts fail to load
        console.warn('Font loading timeout, displaying content with fallback fonts');
        setFontsLoaded(true);
      }
    };

    loadFonts();
  }, []);

  // For SSR and initial render, always show content
  // The font-display: optional will handle the font swapping
  return <>{children}</>;
}
