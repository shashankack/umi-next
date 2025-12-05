"use client";

import Link from "next/link";
import Image from "next/image";
import { Box, Button, Stack, Typography } from "@mui/material";
import { CheckeredGrid } from "@/components/CheckeredGrid";
import { useRef, useState, useEffect } from "react";

interface PostItemProps {
  thumbnail?: string;
  video?: string;
  href: string;
}

function PostItem({ thumbnail, video, href }: PostItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Intersection Observer for lazy loading videos
  useEffect(() => {
    if (!video || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !videoLoaded) {
            setVideoLoaded(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [video, videoLoaded]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && videoLoaded) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Handle autoplay errors silently
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Determine what to show
  const hasVideo = !!video;
  const hasThumbnail = !!thumbnail;

  return (
    <Link href={href} target="_blank">
      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hasVideo && hasThumbnail ? (
          // Case 1: Both thumbnail and video available
          <>
            {/* Thumbnail - show when not hovered */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "relative",
                display: isHovered ? "none" : "block",
              }}
            >
              <Image
                src={thumbnail!}
                alt="Instagram post thumbnail"
                fill
                style={{
                  objectFit: "cover",
                }}
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </Box>
            {/* Video - show and play when hovered, only load when visible */}
            {videoLoaded && (
              <Box
                component="video"
                ref={videoRef}
                src={video}
                muted
                loop
                playsInline
                preload="none"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: isHovered ? "block" : "none",
                }}
              />
            )}
          </>
        ) : hasVideo ? (
          // Case 2: Only video available - play on hover, load when visible
          <Box
            component="video"
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            preload="none"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          // Case 3: Only thumbnail available
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            <Image
              src={thumbnail!}
              alt="Instagram post"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 50vw, 33vw"
              loading="lazy"
            />
          </Box>
        )}
      </Box>
    </Link>
  );
}

export default function InstagramSection() {
  const posts = [
    {
      thumbnail: "/videos/posts/post1.png",
      video: "/videos/posts/reel1.mp4",
      href: "https://www.instagram.com/reel/DJ9K0bHSDBF/",
    },
    {
      thumbnail: "/videos/posts/post2.png",
      video: "/videos/posts/reel2.mp4",
      href: "https://www.instagram.com/umimatchaclub/reel/DPRM1TRCNCO/",
    },
    {
      thumbnail: "/videos/posts/post3.png",
      video: "/videos/posts/reel3.mp4",
      href: "https://www.instagram.com/reel/DJ31hzUy4jr/",
    },
    {
      thumbnail: "/videos/posts/post4.jpg",
      video: "/videos/posts/reel4.mp4",
      href: "https://www.instagram.com/p/DOPCkrpkzeo/",
    },
  ];

  return (
    <Stack
      overflow="hidden"
      position="relative"
      bgcolor="background.default"
      justifyContent="center"
      alignItems="center"
      pt={{ xs: 9, md: 11, lg: 13, xl: 15 }}
    >
      <CheckeredGrid top={0} right={0} left={0} primaryColor="primary.main" />

      <Typography
        variant="h1"
        sx={{
          textAlign: "center",
          py: 4,
          color: "text.secondary",
          fontSize: { xs: "6vw", md: "4vw" },
        }}
      >
        Follow us on Instagram
      </Typography>

      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          px: 2,
          color: "text.primary",
          fontSize: { xs: "4vw", md: "1.5vw" },
        }}
      >
        A little corner of calm, matcha, and everyday joy. Come sip with us.
      </Typography>

      {/* Desktop: Show all 4 boxes with horizontal scroll if needed */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "100%",
          maxWidth: 1400,
          mx: "auto",
          mt: 4,
          position: "relative",
          zIndex: 10,
          px: 2,
          gap: 2,
          overflowX: "auto",
          overflowY: "visible",
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": {
            height: 8,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: 10,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "secondary.main",
            borderRadius: 10,
          },
        }}
      >
        {posts.map((post, index) => (
          <Box
            key={index}
            sx={{
              flex: "0 0 calc(25% - 12px)",
              minWidth: 300,
              height: 300,
              overflow: "hidden",
              borderRadius: 10,
              scrollSnapAlign: "start",
              transition: "all 0.3s ease",
              "&:hover": { boxShadow: 4, transform: "scale(.95)" },
            }}
          >
            <PostItem
              thumbnail={post.thumbnail}
              video={post.video}
              href={post.href}
            />
          </Box>
        ))}
      </Box>

      {/* Mobile: Show 2 boxes, other 2 scrollable horizontally */}
      <Box
        position="relative"
        sx={{
          zIndex: 10,
          display: { xs: "flex", md: "none" },
          width: "100%",
          mt: 4,
          px: 1.5,
          gap: 2,
          overflowX: "auto",

          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {posts.map((post, index) => (
          <Box
            key={index}
            sx={{
              flex: "0 0 calc(50% - 4px)",
              height: 200,
              overflow: "hidden",
              borderRadius: 4,
              scrollSnapAlign: "start",
              transition: "all 0.3s ease",
              "&:hover": { boxShadow: 4, transform: "scale(.95)" },
            }}
          >
            <PostItem
              thumbnail={post.thumbnail}
              video={post.video}
              href={post.href}
            />
          </Box>
        ))}
      </Box>

      {/* Follow Button */}
      <Box mt={{ xs: 4, md: 10 }}>
        <Button
          href="https://www.instagram.com/umimatchaclub"
          target="_blank"
          variant="contained"
          sx={{
            position: "relative",
            zIndex: 10,
            fontFamily: "Bricolage",
            color: "background.default",
            bgcolor: "secondary.main",
            borderRadius: 2,
            textTransform: "none",
            px: 2,
            py: 0,
            my: { xs: 6, md: 6 },
            fontSize: { xs: "4vw", sm: "2vw", md: "2vw", lg: "1.3vw" },
          }}
        >
          Follow
        </Button>
      </Box>

      <Stack
        height={{ xs: "100%", md: "25vw", lg: "20vw" }}
        width="100%"
        position="relative"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          sx={{
            width: { xs: 80, md: 150, lg: 200 },
            height: { xs: 80, md: 150, lg: 200 },
            position: "absolute",
            left: { xs: "2%", md: "5%" },
            top: { xs: -100, md: -170 },
          }}
        >
          <Image
            src="/images/neko/social_left.png"
            alt="Neko character left"
            width={200}
            height={200}
            style={{ width: "100%", height: "auto" }}
            loading="lazy"
          />
        </Box>
        <Box
          sx={{
            width: { xs: 80, md: 150, lg: 200 },
            height: { xs: 80, md: 150, lg: 200 },
            position: "absolute",
            right: { xs: "2%", md: "5%" },
            top: { xs: -100, md: -170 },
          }}
        >
          <Image
            src="/images/neko/social_right.png"
            alt="Neko character right"
            width={200}
            height={200}
            style={{ width: "100%", height: "auto" }}
            loading="lazy"
          />
        </Box>

        <Box
          sx={{
            width: { xs: 90, md: 200 },
            position: "relative",
            zIndex: 20,
            mt: { xs: 0, md: 4 },
          }}
        >
          <Image
            src="/images/neko/hello.png"
            alt="Hello from Neko"
            width={200}
            height={150}
            style={{ width: "100%", height: "auto" }}
            loading="lazy"
          />
        </Box>

        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            mt: { xs: 0, md: 2 },
            mb: { xs: 2, md: 0 },
            color: "background.default",
            fontSize: { xs: "3.6vw", sm: "2.4vw", md: "2vw" },
            fontWeight: 500,
            position: "relative",
            zIndex: 20,
          }}
        >
          Matcha your flow <br /> Shipping pan India
        </Typography>

        <Box
          height={{ xs: "120%", md: "150%" }}
          overflow="hidden"
          sx={{
            position: "absolute",
            bottom: { xs: 0, md: -10 },
            height: { xs: 500, sm: 600, md: 1100 },
            left: 0,
            right: 0,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: {
                xs: "-70%",
                sm: "-70%",
                md: "-70%",
                lg: "-75%",
                xl: "-63%",
              },
              left: 0,
              right: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
            }}
          >
            <Image
              src="/images/backgrounds/pink_wave.png"
              alt="Green wave background"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 1250px, (max-width: 900px) 1500px, 2000px"
              loading="lazy"
            />
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
