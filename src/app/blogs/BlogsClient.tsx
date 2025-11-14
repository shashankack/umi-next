"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  useMediaQuery,
  Stack,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/shopify";
import { blogHelpers } from "@/lib/shopify";
import { FiClock, FiUser, FiCalendar } from "react-icons/fi";

interface BlogsClientProps {
  initialArticles: Article[];
  categories: string[];
  error?: string | null;
}

export default function BlogsClient({
  initialArticles,
  categories,
  error,
}: BlogsClientProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? initialArticles
        : initialArticles.filter(
            (article) => article.blog?.handle === activeCategory
          ),
    [initialArticles, activeCategory]
  );

  const featured = !isMobile && filtered.length > 0 ? filtered[0] : null;
  const list = !isMobile && filtered.length > 0 ? filtered.slice(1) : filtered;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "secondary.main",
        pt: { xs: 18, md: 20 },
        pb: 10,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box textAlign="center" mb={5}>
          <Typography
            variant="h1"
            sx={{
              fontFamily: "Gliker",
              fontSize: { xs: "8vw", md: "4.4vw" },
              color: "background.default",
              mb: 1,
              textShadow: `4px 4px 0 ${theme.palette.primary.main}`,
              lineHeight: 1,
            }}
          >
            Matcha Stories
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "3.4vw", md: "1.6vw" },
              fontFamily: "Bricolage",
              color: "background.default",
              maxWidth: 820,
              mx: "auto",
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            Discover the world of matcha through curated stories, recipes, and
            cultural insights.
          </Typography>
        </Box>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Category filter */}
        {categories.length > 1 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              pb: 1,
              mb: 4,
              "&::-webkit-scrollbar": { height: 8 },
              "&::-webkit-scrollbar-thumb": {
                background: theme.palette.primary.main,
                borderRadius: 8,
              },
            }}
          >
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  onClick={() => setActiveCategory(cat)}
                  sx={{
                    borderRadius: 999,
                    px: 1.5,
                    height: 36,
                    fontFamily: "Bricolage",
                    textTransform: "capitalize",
                    color: active
                      ? theme.palette.primary.main
                      : theme.palette.background.default,
                    backgroundColor: active
                      ? theme.palette.background.default
                      : "transparent",
                    border: `2px solid ${theme.palette.background.default}`,
                    "&:hover": {
                      backgroundColor: active
                        ? theme.palette.background.default
                        : "rgba(255,255,255,0.12)",
                    },
                    transition: "all .2s ease",
                  }}
                />
              );
            })}
          </Box>
        )}

        {/* Empty State */}
        {filtered.length === 0 && !error && (
          <Box textAlign="center" py={8}>
            <Typography
              variant="h5"
              color="background.default"
              fontFamily="Bricolage"
            >
              No articles found in this category.
            </Typography>
          </Box>
        )}

        {/* Layout: Featured + list */}
        {filtered.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 4,
            }}
          >
            {/* Featured Article */}
            {!isMobile && featured && (
              <Box sx={{ flex: { xs: 1, lg: 3 }, minWidth: 0 }}>
                <Link
                  href={blogHelpers.getArticleUrl(featured)}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    sx={{
                      position: "relative",
                      height: 700,
                      borderRadius: "24px",
                      overflow: "hidden",
                      border: `4px solid ${theme.palette.background.default}`,
                      cursor: "pointer",
                      transform: "translateZ(0)",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: theme.palette.primary.main,
                      },
                      transition: "all .25s ease",
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <Image
                        src={
                          featured.image?.url || "/images/placeholder-blog.png"
                        }
                        alt={featured.image?.altText || featured.title}
                        fill
                        style={{
                          objectFit: "cover",
                          filter: "saturate(0.95)",
                        }}
                        sizes="(max-width: 900px) 100vw, 50vw"
                        priority
                      />
                    </Box>
                    {/* Overlay gradient */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.55) 85%)",
                      }}
                    />
                    {/* Category chip */}
                    {featured.blog?.handle && (
                      <Chip
                        label={featured.blog.handle}
                        sx={{
                          position: "absolute",
                          top: 16,
                          left: 16,
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.background.default,
                          fontFamily: "Bricolage",
                          fontSize: "0.9rem",
                          height: 32,
                          borderRadius: 2,
                          boxShadow: `0 3px 0 ${theme.palette.secondary.main}`,
                          textTransform: "capitalize",
                          "& .MuiChip-label": { px: 2 },
                        }}
                      />
                    )}
                    {/* Content overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        p: { xs: 2.5, md: 4 },
                        color: theme.palette.background.default,
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: "Gliker",
                          color: theme.palette.background.default,
                          fontSize: { xs: "1.6rem", md: "2.2rem" },
                          lineHeight: 1.15,
                          mb: 1.5,
                          textShadow: "0 2px 12px rgba(0,0,0,0.45)",
                        }}
                      >
                        {featured.title}
                      </Typography>

                      {featured.excerpt && (
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "Bricolage",
                            color: theme.palette.background.default,
                            opacity: 0.95,
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: 2,
                            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                          }}
                        >
                          {blogHelpers.stripHtml(featured.excerpt)}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.75,
                            }}
                          >
                            <FiUser
                              size={16}
                              color={theme.palette.background.default}
                            />
                            <Typography
                              sx={{
                                fontFamily: "Bricolage",
                                fontSize: "0.9rem",
                              }}
                            >
                              {blogHelpers.getAuthorName(featured)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.75,
                            }}
                          >
                            <FiCalendar
                              size={16}
                              color={theme.palette.background.default}
                            />
                            <Typography
                              sx={{
                                fontFamily: "Bricolage",
                                fontSize: "0.9rem",
                              }}
                            >
                              {blogHelpers.formatPublishedDate(featured)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <FiClock
                            size={16}
                            color={theme.palette.background.default}
                          />
                          <Typography
                            sx={{ fontFamily: "Bricolage", fontSize: "0.9rem" }}
                          >
                            {blogHelpers.getReadingTime(featured)} min read
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Link>
              </Box>
            )}

            {/* List */}
            <Box sx={{ flex: { xs: 1, lg: 2 } }}>
              <Box
                sx={{
                  height: { xs: "auto", lg: 700 },
                  overflowY: { xs: "visible", lg: "auto" },
                  pr: { lg: 1 },
                  "&::-webkit-scrollbar": { width: 8 },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: 10,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 10,
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              >
                <Stack spacing={2.5}>
                  {list.map((article) => (
                    <Link
                      key={article.id}
                      href={blogHelpers.getArticleUrl(article)}
                      style={{ textDecoration: "none" }}
                    >
                      <Card
                        sx={{
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 3,
                          border: `2px solid transparent`,
                          overflow: "hidden",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          height: { xs: "auto", sm: 170 },
                          transition:
                            "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 10px 30px rgba(0,0,0,.12)",
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            width: { xs: "100%", sm: 180 },
                            height: { xs: 160, sm: 170 },
                            flexShrink: 0,
                          }}
                        >
                          <Image
                            src={
                              article.image?.url ||
                              "/images/placeholder-blog.png"
                            }
                            alt={article.image?.altText || article.title}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 600px) 100vw, 180px"
                            loading="lazy"
                          />
                        </Box>
                        <CardContent
                          sx={{
                            p: 2,
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            {article.blog?.handle && (
                              <Chip
                                label={article.blog.handle}
                                size="small"
                                sx={{
                                  backgroundColor: theme.palette.secondary.main,
                                  color: theme.palette.background.default,
                                  fontFamily: "Bricolage",
                                  height: 24,
                                  borderRadius: 1,
                                  textTransform: "capitalize",
                                }}
                              />
                            )}
                            <Typography
                              variant="caption"
                              sx={{
                                fontFamily: "Bricolage",
                                color: theme.palette.primary.main,
                              }}
                            >
                              {blogHelpers.formatPublishedDate(article)} •{" "}
                              {blogHelpers.getReadingTime(article)} min read
                            </Typography>
                          </Box>

                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: "Gliker",
                              color: theme.palette.secondary.main,
                              lineHeight: 1.25,
                              fontWeight: 800,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {article.title}
                          </Typography>

                          {article.excerpt && (
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "Bricolage",
                                color: theme.palette.secondary.main,
                                opacity: 0.85,
                                lineHeight: 1.5,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                flexGrow: 1,
                              }}
                            >
                              {blogHelpers.stripHtml(article.excerpt)}
                            </Typography>
                          )}

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontFamily: "Bricolage",
                                color: theme.palette.primary.main,
                              }}
                            >
                              {blogHelpers.getAuthorName(article)}
                            </Typography>
                            <Button
                              size="small"
                              sx={{
                                textTransform: "none",
                                fontFamily: "Bricolage",
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.background.default,
                                px: 1.5,
                                py: 0.6,
                                borderRadius: 999,
                                boxShadow: `0 3px 0 ${theme.palette.secondary.main}`,
                                "&:hover": {
                                  backgroundColor:
                                    theme.palette.background.default,
                                  color: theme.palette.primary.main,
                                },
                              }}
                            >
                              Read story
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>
        )}

        {/* CTA */}
        <Box textAlign="center" mt={8}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Gliker",
              color: "background.default",
              mb: 2,
            }}
          >
            Want to share your matcha story?
          </Typography>
          <Link href="/contact" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.default,
                fontFamily: "Bricolage",
                fontSize: "1.05rem",
                py: 1.4,
                px: 4,
                borderRadius: "999px",
                textTransform: "none",
                boxShadow: `0 4px 0 ${theme.palette.background.default}`,
                "&:hover": {
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.primary.main,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.25s ease",
              }}
            >
              Get in Touch
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
