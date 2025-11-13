"use client";

import Link from "next/link";
import { Box, Button, Stack, Typography } from "@mui/material";
import { CheckeredGrid } from "@/components/CheckeredGrid";
import { useRef, useState } from "react";

interface PostItemProps {
  thumbnail?: string;
  video?: string;
  href: string;
}

function PostItem({ thumbnail, video, href }: PostItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
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
              component="img"
              src={thumbnail}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: isHovered ? "none" : "block",
              }}
            />
            {/* Video - show and play when hovered */}
            <Box
              component="video"
              ref={videoRef}
              src={video}
              muted
              loop
              playsInline
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: isHovered ? "block" : "none",
              }}
            />
          </>
        ) : hasVideo ? (
          // Case 2: Only video available - play on hover
          <Box
            component="video"
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          // Case 3: Only thumbnail available
          <Box
            component="img"
            src={thumbnail}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </Box>
    </Link>
  );
}

export default function InstagramSection() {
  const posts = [
    {
      video: "/videos/posts/reel1.mp4",
      href: "https://www.instagram.com/reel/DJ9K0bHSDBF/",
    },
    {
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
        sx={{
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
            fontFamily: "Bricolage",
            color: "background.default",
            bgcolor: "secondary.main",
            borderRadius: 2,
            textTransform: "none",
            px: 2,
            py: 0,
            my: { xs: 6, md: 6 },
            fontSize: { xs: "4vw", md: "1.5rem" },
          }}
        >
          Follow
        </Button>
      </Box>

      <Stack
        height={{ xs: "100%", md: "25vw", lg: "20vw" }}
        borderColor="primary.main"
        width="100%"
        position="relative"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          component="img"
          src="/images/neko/social_left.png"
          width={{ xs: 80, md: 200 }}
          position="absolute"
          left={{ xs: "2%", md: "5%" }}
          top={{ xs: -100, md: -170 }}
        />
        <Box
          component="img"
          src="/images/neko/social_right.png"
          width={{ xs: 80, md: 200 }}
          position="absolute"
          right={{ xs: "2%", md: "5%" }}
          top={{ xs: -100, md: -170 }}
        />

        <Box
          component="img"
          src="/images/neko/hello.png"
          sx={{
            width: { xs: 90, md: 200 },
            position: "relative",
            zIndex: 20,
            mt: { xs: 0, md: 4 },
          }}
        />

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
          height={{ xs: "120%", md: "100%" }}
          overflow="hidden"
          sx={{
            position: "absolute",
            bottom: { xs: 0, md: -10 },
            left: 0,
            right: 0,
          }}
        >
          <Box
            component="img"
            src="/images/backgrounds/pink_wave.png"
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              zIndex: 10,
              width: { xs: "180vw", md: "175%" },
              objectFit: "cover",
            }}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
