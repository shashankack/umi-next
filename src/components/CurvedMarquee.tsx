"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const CurvedMarquee: React.FC = () => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  // Initialize to false to match server render, update after mount
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // set mobile flag after mount for SSR safety
    const handleResize = () => setIsMobile(window.innerWidth <= 500);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!pathRef.current || !textPathRef.current) return;

    const pathLength = pathRef.current.getTotalLength();
    const animation = gsap.to(textPathRef.current, {
      attr: { startOffset: -pathLength + 300 },
      repeat: -1,
      ease: "none",
      duration: 15,
    });

    return () => {
      if (animation) animation.kill();
    };
  }, []);

  return (
    <div className="curved-marquee">
      {isMobile ? (
        <svg viewBox="0 0 550 70">
          <defs>
            <path
              id="curve"
              ref={pathRef}
              d="M0,160 C900, 60 640,370 1400,90"
              fill="none"
            />
          </defs>

          <use
            href="#curve"
            stroke="#f79995"
            strokeWidth="15"
            fill="none"
            strokeLinecap="round"
          />

          <text dy="8">
            <textPath
              ref={textPathRef}
              href="#curve"
              startOffset="0"
              textLength={3500}
              spacing="auto"
            >
              * matcha your flow * matcha your flow * matcha your flow * matcha
              your flow * matcha your flow * matcha your flow * matcha your flow
              * matcha your flow * matcha your flow * matcha your flow * matcha
              your flow * matcha your flow *
            </textPath>
          </text>
        </svg>
      ) : (
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none">
          <defs>
            <path
              id="curve"
              ref={pathRef}
              d="M0,130 C500,0 700,200 1200,100"
              fill="none"
            />
          </defs>

          <use
            href="#curve"
            stroke="#f79995"
            strokeWidth="55"
            fill="none"
            strokeLinecap="round"
          />

          <text dy="10">
            <textPath
              ref={textPathRef}
              href="#curve"
              startOffset="0"
              textLength={3800}
              spacing="auto"
            >
              * matcha your flow * matcha your flow * matcha your flow * matcha
              your flow * matcha your flow * matcha your flow * matcha your flow
              * matcha your flow * matcha your flow * matcha your flow * matcha
              your flow * matcha your flow *
            </textPath>
          </text>
        </svg>
      )}

      {/* Inline styles: exact same rules as your SCSS, just inlined via styled-jsx */}
      <style jsx>{`
        .curved-marquee {
          width: 100%;
          overflow: hidden;
          background-color: transparent;
        }
        .curved-marquee svg {
          width: 100%;
          height: 300px;
        }
        .curved-marquee svg text {
          fill: #fff1cc;
          font-size: 30px;
          font-weight: bold;
          font-weight: 500;
          font-family: "Bricolage";
        }

        /* Tablet (1560px) */
        @media (max-width: 1560px) {
          .curved-marquee svg {
            margin-bottom: 60px;
            height: 180px;
          }
          .curved-marquee text {
            font-size: 22px;
          }
          .curved-marquee use {
            stroke-width: 70px;
          }
        }

        /* Mobile (500px) */
        @media (max-width: 500px) {
          .curved-marquee svg {
            height: 250px;
          }
          .curved-marquee svg text {
            font-size: 24px;
          }
        }

        /* Extra Small Mobile (425px) */
        @media (max-width: 425px) {
          .curved-marquee svg {
            height: 240px;
          }
          .curved-marquee text {
            font-size: 20px;
          }
        }

        /* Extra Small Mobile (350px) */
        @media (max-width: 350px) {
          .curved-marquee svg {
            height: 200px;
          }
          .curved-marquee text {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default CurvedMarquee;
