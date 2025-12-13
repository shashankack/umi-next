"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/shopify";
import { blogHelpers } from "@/lib/shopify";
import { FiClock, FiCalendar, FiArrowRight } from "react-icons/fi";

interface BlogsClientProps {
  initialArticles: Article[];
  categories: string[];
  error?: string | null;
}

export default function BlogsClient({
  initialArticles,
  error,
}: BlogsClientProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "secondary.main",
        pt: { xs: 16, md: 18 },
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box textAlign="center" mb={{ xs: 6, md: 8 }}>
          <Typography
            variant="h1"
            sx={{
              fontFamily: "Gliker",
              fontSize: { xs: "12vw", sm: "8vw", md: "5.5vw" },
              color: "background.default",
              mb: 2,
              textShadow: `5px 5px 0 ${theme.palette.primary.main}`,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            Matcha Stories
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1rem", sm: "1.15rem", md: "1.3rem" },
              fontFamily: "Bricolage",
              color: "background.default",
              maxWidth: 700,
              mx: "auto",
              lineHeight: 1.7,
              opacity: 0.95,
              fontWeight: 400,
            }}
          >
            Explore recipes, wellness tips, and the art of matcha
          </Typography>
        </Box>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {initialArticles.length === 0 && !error && (
          <Box textAlign="center" py={{ xs: 10, md: 12 }} px={2}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Gliker",
                color: "background.default",
                mb: 1.5,
                fontSize: { xs: "1.8rem", md: "2.2rem" },
              }}
            >
              No articles found
            </Typography>
          </Box>
        )}

        {/* Articles Grid */}
        {initialArticles.length > 0 && (
          <Grid container spacing={{ xs: 2.5, md: 3.5 }}>
            {initialArticles.map((article, index) => (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
                key={article.id}
              >
                <Link
                  href={blogHelpers.getArticleUrl(article)}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: theme.palette.background.default,
                      borderRadius: { xs: "16px", md: "20px" },
                      border: `3px solid transparent`,
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: `0 4px 0 ${theme.palette.secondary.main}`,
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 3px 0 ${theme.palette.primary.main}`,
                        "& .article-image": {
                          transform: "scale(1.03)",
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 220,
                        overflow: "hidden",
                        backgroundColor: theme.palette.secondary.main,
                      }}
                    >
                      <Image
                        className="article-image"
                        src={
                          article.image?.url || "/images/placeholder-blog.png"
                        }
                        alt={article.image?.altText || article.title}
                        fill
                        style={{
                          objectFit: "cover",
                          transition:
                            "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                        loading={index < 6 ? "eager" : "lazy"}
                      />
                      {/* {article.blog?.handle && (
                        <Chip
                          label={article.blog.handle}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            backgroundColor: theme.palette.secondary.main,
                            color: theme.palette.background.default,
                            fontFamily: "Bricolage",
                            fontWeight: 600,
                            height: 28,
                            borderRadius: "8px",
                            textTransform: "capitalize",
                            fontSize: "0.8rem",
                          }}
                        />
                      )} */}
                    </Box>
                    <CardContent
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "Gliker",
                          color: theme.palette.secondary.main,
                          fontSize: { xs: "1.15rem", md: "1.3rem" },
                          lineHeight: 1.3,
                          mb: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "2.6em",
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
                            opacity: 0.75,
                            lineHeight: 1.6,
                            fontSize: "0.9rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: 2,
                            flex: 1,
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
                          pt: 1.5,
                          borderTop: `1px solid ${theme.palette.secondary.main}20`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "Bricolage",
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                              fontSize: "0.8rem",
                            }}
                          >
                            {blogHelpers.getAuthorName(article)}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "Bricolage",
                              color: theme.palette.secondary.main,
                              opacity: 0.6,
                              fontSize: "0.75rem",
                            }}
                          >
                            {blogHelpers.formatPublishedDate(article)} •{" "}
                            {blogHelpers.getReadingTime(article)}m
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            backgroundColor: theme.palette.primary.main,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 3px 0 ${theme.palette.secondary.main}`,
                          }}
                        >
                          <FiArrowRight
                            size={18}
                            color={theme.palette.background.default}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
