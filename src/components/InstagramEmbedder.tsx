import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

type InstagramEmbedProps = {
  /** The Instagram post URL (permalink) */
  url: string;
  /** Show Instagram’s caption under the embed */
  showCaption?: boolean;
  /** Optional: override data-instgrm-version */
  version?: string;
};

const InstagramEmbed: React.FC<InstagramEmbedProps> = ({
  url,
  showCaption = true,
  version = "14",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Add the Instagram embed script if it isn't present
    const scriptSrc = "https://www.instagram.com/embed.js";
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${scriptSrc}"]`
    );

    const processEmbeds = () => {
      window.instgrm?.Embeds?.process();
    };

    if (!existing) {
      const s = document.createElement("script");
      s.src = scriptSrc;
      s.async = true;
      s.onload = processEmbeds;
      document.body.appendChild(s);
    } else {
      // If the script already exists, process immediately
      processEmbeds();
    }
  }, [url]);

  return (
    <div ref={containerRef}>
      <blockquote
        className="instagram-media"
        data-instgrm-captioned={showCaption ? "" : undefined}
        data-instgrm-permalink={url}
        data-instgrm-version={version}
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: 3,
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: 1,
          maxWidth: 540,
          minWidth: 326,
          padding: 0,
          width: "calc(100% - 2px)",
        }}
      >
        {/* Minimal inner structure is fine; Instagram replaces it when processed */}
        <div style={{ padding: 16 }}>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#FFFFFF",
              lineHeight: 0,
              padding: 0,
              textAlign: "center",
              textDecoration: "none",
              width: "100%",
              display: "block",
            }}
          >
            <div style={{ padding: "19% 0" }} />
            <div style={{ paddingTop: 8 }}>
              <div
                style={{
                  color: "#3897f0",
                  fontFamily: "Arial,sans-serif",
                  fontSize: 14,
                  fontStyle: "normal",
                  fontWeight: 550,
                  lineHeight: "18px",
                }}
              >
                View this post on Instagram
              </div>
            </div>
          </a>
        </div>
      </blockquote>
    </div>
  );
};

export default InstagramEmbed;
