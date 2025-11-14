"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  useTheme,
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Snackbar,
  Alert,
  Container,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
} from "@mui/material";
import Image from "next/image";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import type { Article } from "@/lib/shopify";
import { blogHelpers } from "@/lib/shopify";
import {
  FiArrowLeft,
  FiClock,
  FiCalendar,
  FiShare2,
  FiList,
  FiX,
} from "react-icons/fi";

interface ArticleClientProps {
  article: Article;
  relatedArticles: Article[];
}

const CONTENT_MAX = 1160;

export default function ArticleClient({
  article,
  relatedArticles,
}: ArticleClientProps) {
  const theme = useTheme();
  const [copiedOpen, setCopiedOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [tocItems, setTocItems] = useState<
    Array<{ id: string; title: string; level: number; isSubItem: boolean }>
  >([]);
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);

  // Helper function to generate ID from text
  const generateIdFromText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Extract TOC items dynamically from HTML content
  const extractTocItems = useCallback((htmlContent: string) => {
    if (!htmlContent) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Strategy 1: Try to extract from existing nav TOC
    const tocNav = doc.querySelector("nav[aria-label='Table of Contents']");

    // if (DEBUG_TOC) console.log("TOC Nav found:", !!tocNav);

    if (tocNav) {
      const tocItems: Array<{
        id: string;
        title: string;
        level: number;
        isSubItem: boolean;
      }> = [];
      const topLevelItems = Array.from(tocNav.querySelectorAll("ul > li"));

      // if (DEBUG_TOC)
      //   console.log("Top level items found:", topLevelItems.length);

      topLevelItems.forEach((li) => {
        const isTopLevel = !li.parentElement?.closest("li");

        if (!isTopLevel) return;

        const textNode = Array.from(li.childNodes).find(
          (node) => node.nodeType === 3
        );
        const directText = textNode ? textNode.textContent?.trim() : "";

        if (!directText) return;

        const potentialId = generateIdFromText(directText);
        let matchingHeading = doc.getElementById(potentialId);

        if (!matchingHeading) {
          const allHeadings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
          matchingHeading =
            (Array.from(allHeadings).find(
              (heading) =>
                heading.textContent
                  ?.trim()
                  .toLowerCase()
                  .includes(directText.toLowerCase()) ||
                directText
                  .toLowerCase()
                  .includes(heading.textContent?.trim().toLowerCase() || "")
            ) as HTMLElement | undefined) || null;
        }

        const finalId = matchingHeading?.id || potentialId;

        tocItems.push({
          id: finalId,
          title: directText,
          level: 2,
          isSubItem: false,
        });

        // Handle nested items
        const nestedUl = li.querySelector("ul");
        if (nestedUl) {
          const subItems = nestedUl.querySelectorAll("li");
          subItems.forEach((subLi) => {
            const subText = subLi.textContent?.trim();
            if (!subText) return;

            const subId = generateIdFromText(subText);
            let subMatchingHeading = doc.getElementById(subId);

            if (!subMatchingHeading) {
              const allHeadings = doc.querySelectorAll(
                "h1, h2, h3, h4, h5, h6"
              );
              subMatchingHeading =
                (Array.from(allHeadings).find(
                  (heading) =>
                    heading.textContent
                      ?.trim()
                      .toLowerCase()
                      .includes(subText.toLowerCase()) ||
                    subText
                      .toLowerCase()
                      .includes(heading.textContent?.trim().toLowerCase() || "")
                ) as HTMLElement | undefined) || null;
            }

            const finalSubId = subMatchingHeading?.id || subId;

            tocItems.push({
              id: finalSubId,
              title: subText,
              level: 3,
              isSubItem: true,
            });
          });
        }
      });

      // if (DEBUG_TOC) console.log("Final TOC items:", tocItems);

      return tocItems;
    }

    // Fallback: Extract headings directly
    const headingsWithIds = doc.querySelectorAll(
      "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"
    );
    if (headingsWithIds.length > 0) {
      return Array.from(headingsWithIds).map((heading) => ({
        id: heading.id,
        title: heading.textContent?.trim() || "",
        level: parseInt(heading.tagName.charAt(1)),
        isSubItem: parseInt(heading.tagName.charAt(1)) > 2,
      }));
    }

    // Extract all headings and generate IDs
    const allHeadings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const tocItems = Array.from(allHeadings).map((heading) => {
      const text = heading.textContent?.trim() || "";
      const generatedId = generateIdFromText(text);
      const finalId = heading.id || generatedId;

      return {
        id: finalId,
        title: text,
        level: parseInt(heading.tagName.charAt(1)),
        isSubItem: parseInt(heading.tagName.charAt(1)) > 2,
      };
    });

    return tocItems;
  }, []);

  // Update TOC items when article content changes
  useEffect(() => {
    if (article?.contentHtml) {
      const items = extractTocItems(article.contentHtml);
      setTocItems(items);
    }
  }, [article?.contentHtml, extractTocItems]);

  const chips = useMemo(
    () => (Array.isArray(article?.tags) ? article.tags.slice(0, 12) : []),
    [article?.tags]
  );

  const handleFaqChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedFaq(isExpanded ? panel : false);
    };

  // Custom content renderer
  const renderBlogContent = (htmlContent: string) => {
    if (!htmlContent) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Ensure all headings have proper IDs
    const allHeadings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
    allHeadings.forEach((heading) => {
      if (!heading.id) {
        const text = heading.textContent?.trim() || "";
        heading.id = generateIdFromText(text);
      }
    });

    const faqSections = doc.querySelectorAll(".faq-section");

    if (faqSections.length === 0) {
      const updatedHtml = doc.documentElement.outerHTML;
      return (
        <Box
          sx={{
            fontFamily: "Bricolage",
            color: "secondary.main",
            lineHeight: 1.9,
            mb: 6,

            "& nav[aria-label='Table of Contents']": {
              display: "none",
            },

            "& h2": {
              fontFamily: "Gliker",
              color: "primary.main",
              fontSize: { xs: "6vw", sm: "1.8vw" },
              marginTop: "2.5rem",
              marginBottom: "1.2rem",
              fontWeight: 700,
              scrollMarginTop: "100px",
            },
            "& h3": {
              fontFamily: "Gliker",
              color: "primary.main",
              fontSize: { xs: "5vw", sm: "1.4vw" },
              fontWeight: 600,
              scrollMarginTop: "100px",
            },
            "& p": {
              textAlign: "justify",
              marginBottom: "1rem",
              paddingLeft: { xs: 0, md: 2 },
              fontSize: { xs: "3.6vw", md: "1vw" },
            },
            "& ul": {
              fontSize: { xs: "3.2vw", md: ".8vw" },
              color: "primary.main",
              margin: "1.5rem 0",
              paddingLeft: { xs: 3, md: "3rem" },

              "& li": {
                fontSize: { xs: "3.2vw", md: ".8vw" },
                marginBottom: "0.7rem",
                lineHeight: 1.7,
              },
            },

            "& img": {
              maxWidth: "100%",
              width: "100%",
              height: { xs: "200px", sm: "300px", md: "400px" },
              objectFit: "cover",
              borderRadius: 3,
              margin: "2rem 0",
              display: "block",
              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              },
            },
            "& hr": {
              border: "none",
              height: 2,
              background: theme.palette.primary.main,
              margin: "3rem 0",
              borderRadius: 2,
            },
            "& a": {
              color: "primary.main",
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": {
                color: "secondary.main",
              },
            },

            "& .cta-section": {
              bgcolor: "secondary.main",
              borderRadius: 3,
              padding: 3,
              color: "background.default",
              "& h2, & h3": {
                fontFamily: "Gliker",
                marginTop: 0,
                color: "background.default",
              },
              "& a": {
                color: "background.default",
              },
              "& ul": {
                margin: "1.5rem 0",
                paddingLeft: { xs: 3, md: "3rem" },
                fontSize: { xs: "3.6vw", md: "1vw" },
              },
              "& li": {
                fontSize: { xs: "3.6vw", md: "1vw" },
                marginBottom: "0.7rem",
                lineHeight: 1.7,
              },
            },
          }}
          dangerouslySetInnerHTML={{ __html: updatedHtml }}
        />
      );
    }

    // Process content with FAQ sections
    const parts: React.ReactNode[] = [];
    const updatedHtml = doc.body.innerHTML;
    let currentHtml = updatedHtml;

    faqSections.forEach((faqSection, sectionIndex) => {
      const faqHtml = faqSection.outerHTML;
      const beforeFaq = currentHtml.split(faqHtml)[0];
      const afterFaq = currentHtml.split(faqHtml)[1];

      // Add content before FAQ
      if (beforeFaq.trim()) {
        parts.push(
          <Box
            key={`before-faq-${sectionIndex}`}
            sx={{
              fontFamily: "Bricolage",
              color: "secondary.main",
              fontSize: "1.125rem",
              lineHeight: 1.9,
              "& nav[aria-label='Table of Contents']": {
                display: "none",
              },
              "& h2": {
                fontSize: { xs: "6vw", sm: "1.8vw" },
                fontFamily: "Gliker",
                color: "primary.main",
                marginTop: "2.5rem",
                marginBottom: "1.2rem",
                fontWeight: 700,
                scrollMarginTop: "100px",
              },
              "& h3": {
                fontSize: { xs: "5vw", sm: "1.4vw" },
                fontFamily: "Gliker",
                color: "primary.main",
                fontWeight: 600,
                scrollMarginTop: "100px",
              },
              "& p": {
                textAlign: "justify",
                marginBottom: "1.25rem",
                paddingLeft: { xs: 0, sm: 2 },
                fontSize: { xs: "3.6vw", md: "1vw" },
              },
              "& img": {
                maxWidth: "100%",
                width: "100%",
                height: { xs: "200px", sm: "300px", md: "400px" },
                objectFit: "cover",
                borderRadius: 3,
                margin: "2rem 0",
                display: "block",
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                },
              },
              "& hr": {
                border: "none",
                height: 2,
                background: theme.palette.primary.main,
                margin: "3rem 0",
                borderRadius: 2,
              },
              "& a": {
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": {
                  color: "secondary.main",
                },
              },
              "& ul": {
                fontSize: { xs: "3.2vw", md: ".8vw" },
                margin: "1.5rem 0",
                paddingLeft: { xs: 3, md: "3rem" },
              },
              "& li": {
                fontSize: { xs: "3.2vw", md: ".8vw" },
                marginBottom: "0.7rem",
                lineHeight: 1.7,
              },
            }}
            dangerouslySetInnerHTML={{ __html: beforeFaq }}
          />
        );
      }

      // Extract FAQ data
      const titleElement = faqSection.querySelector("h2");
      const title = titleElement
        ? titleElement.textContent?.trim()
        : "Frequently Asked Questions";
      const h3Elements = faqSection.querySelectorAll("h3");
      const faqItems: Array<{ question: string; answer: string }> = [];

      h3Elements.forEach((h3) => {
        const questionText = h3.textContent?.trim().replace(/^Q:\s*/, "") || "";
        let nextElement = h3.nextElementSibling;
        let answer = "";

        while (nextElement && nextElement.tagName !== "H3") {
          if (nextElement.tagName === "P") {
            const answerText = nextElement.innerHTML
              .trim()
              .replace(/^A:\s*/, "");
            answer += answerText;
            break;
          }
          nextElement = nextElement.nextElementSibling;
        }

        if (questionText && answer) {
          faqItems.push({ question: questionText, answer });
        }
      });

      // Add MUI FAQ Accordion
      const faqId =
        (faqSection as HTMLElement).id || generateIdFromText(title || "");
      parts.push(
        <Box
          key={`faq-${sectionIndex}`}
          id={faqId}
          sx={{
            my: 4,
            p: { xs: 2, md: 4 },
            backgroundColor: "secondary.main",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            scrollMarginTop: "100px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Gliker",
              color: "background.default",
              mb: 3,
              textAlign: "center",
              fontWeight: 700,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            {title}
          </Typography>

          {faqItems.map((item, index) => (
            <Accordion
              key={`${sectionIndex}-${index}`}
              expanded={expandedFaq === `panel${sectionIndex}-${index}`}
              onChange={handleFaqChange(`panel${sectionIndex}-${index}`)}
              sx={{
                backgroundColor: "background.default",
                borderRadius: "12px !important",
                mb: 2,
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
                "&:before": {
                  display: "none",
                },
                "&.Mui-expanded": {
                  margin: "0 0 16px 0",
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px rgba(0,0,0,0.15)`,
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: "1.8rem",
                      transition: "transform 0.3s ease",
                    }}
                  />
                }
                sx={{
                  backgroundColor: "transparent",
                  borderRadius: "12px",
                  py: 2,
                  px: 3,
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}10`,
                  },
                  "&.Mui-expanded": {
                    minHeight: "64px",
                  },
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                    "&.Mui-expanded": {
                      margin: "12px 0",
                    },
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Bricolage",
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    lineHeight: 1.4,
                    pr: 2,
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  pt: 0,
                  pb: 3,
                  px: 3,
                  borderTop: `1px solid ${theme.palette.primary.main}20`,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Bricolage",
                    color: "secondary.main",
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    lineHeight: 1.7,
                    textAlign: "justify",
                    "& strong": {
                      color: "primary.main",
                      fontWeight: 600,
                    },
                    "& em": {
                      fontStyle: "italic",
                      color: "primary.main",
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      );

      currentHtml = afterFaq;
    });

    // Add remaining content after last FAQ
    if (currentHtml && currentHtml.trim()) {
      parts.push(
        <Box
          key="after-last-faq"
          sx={{
            fontFamily: "Bricolage",
            color: "secondary.main",
            fontSize: "1.125rem",
            lineHeight: 1.9,
            "& nav[aria-label='Table of Contents']": {
              display: "none",
            },
            "& h2": {
              fontFamily: "Gliker",
              color: "primary.main",
              marginTop: "2.5rem",
              marginBottom: "1.2rem",
              fontWeight: 700,
              scrollMarginTop: "100px",
            },
            "& h3": {
              fontFamily: "Gliker",
              color: "primary.main",
              fontWeight: 600,
              scrollMarginTop: "100px",
            },
            "& p": {
              textAlign: "justify",
              marginBottom: "1.25rem",
              paddingLeft: { xs: 0, sm: 2 },
              fontSize: { xs: "3.6vw", md: "1vw" },
            },
            "& img": {
              maxWidth: "100%",
              width: "100%",
              height: { xs: "200px", sm: "300px", md: "400px" },
              objectFit: "cover",
              borderRadius: 3,
              margin: "2rem 0",
              display: "block",
              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              },
            },
            "& hr": {
              border: "none",
              height: 2,
              background: theme.palette.primary.main,
              margin: "3rem 0",
              borderRadius: 2,
            },
            "& a": {
              color: "primary.main",
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": {
                color: "secondary.main",
              },
            },
            "& ul": {
              fontSize: { xs: "3.6vw", md: "1vw" },
              margin: "1.5rem 0",
              paddingLeft: { xs: 3, md: "3rem" },
            },
            "& li": {
              fontSize: { xs: "3.6vw", md: "1vw" },
              marginBottom: "0.7rem",
              lineHeight: 1.7,
            },
          }}
          dangerouslySetInnerHTML={{ __html: currentHtml }}
        />
      );
    }

    return <>{parts}</>;
  };

  const handleShare = async () => {
    if (!article) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || "",
          url: window.location.href,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } finally {
        setCopiedOpen(true);
      }
    }
  };

  // TOC Navigation Component
  const TocNavigation = ({
    items,
    isMobile = false,
    onItemClick,
  }: {
    items: typeof tocItems;
    isMobile?: boolean;
    onItemClick?: () => void;
  }) => (
    <Box
      sx={{
        "& a": {
          display: "block",
          color: "background.default",
          textDecoration: "none",
          py: 1,
          px: 2,
          borderRadius: 2,
          fontSize: isMobile ? "0.9rem" : "0.95rem",
          fontFamily: "Bricolage",
          transition: "all 0.2s ease",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "primary.main",
            transform: isMobile ? "none" : "translateX(8px)",
          },
          "&.sub-item": {
            ml: 2,
            fontSize: isMobile ? "0.8rem" : "0.85rem",
            fontFamily: "Bricolage",
            opacity: 0.9,
            pl: 4,
          },
        },
      }}
    >
      {items.map((item) => (
        <a
          key={item.id}
          onClick={() => {
            // if (DEBUG_TOC) console.log(`Attempting to scroll to: ${item.id}`);
            const element = document.getElementById(item.id);
            // if (DEBUG_TOC) console.log(`Found element:`, element);

            if (element) {
              element.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            } else {
              setTimeout(() => {
                const delayedElement = document.getElementById(item.id);
                // if (DEBUG_TOC)
                //   console.log(`Delayed search found element:`, delayedElement);
                if (delayedElement) {
                  delayedElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }, 100);
            }

            if (onItemClick) onItemClick();
          }}
          className={item.isSubItem ? "sub-item" : ""}
        >
          {item.isSubItem ? `• ${item.title}` : item.title}
        </a>
      ))}
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          bgcolor: "background.default",
          "& html": {
            scrollBehavior: "smooth",
          },
        }}
      >
        {/* HERO — full width */}
        <Box
          sx={{
            bgcolor: "background.default",
            width: "100%",
            minHeight: { xs: "48vh", md: "64vh" },
            backgroundImage: `url(${
              article.image?.url || "/images/placeholder-blog.png"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* gradient overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,.45) 60%, rgba(0,0,0,.6) 100%)",
            }}
          />

          {/* category chip + title */}
          <Box
            sx={{
              position: "absolute",
              bottom: 24,
              left: 24,
              right: 24,
              zIndex: 2,
            }}
          >
            <Link href="/blogs" style={{ textDecoration: "none" }}>
              <Button
                startIcon={<FiArrowLeft />}
                sx={{
                  backdropFilter: "blur(4px)",
                  bgcolor: "rgba(255,255,255,0.4)",
                  color: "background.default",
                  borderRadius: "24px",
                  mt: 2,
                  px: 2.2,
                  py: 0.8,
                  fontFamily: "Bricolage",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "background.default",
                  },
                }}
              >
                Back to Blogs
              </Button>
            </Link>
            <Box sx={{ color: "background.default", maxWidth: CONTENT_MAX }}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "Gliker",
                  fontSize: { xs: "2rem", md: "3rem", lg: "3.5rem" },
                  lineHeight: 1.15,
                  textShadow: "0 2px 24px rgba(0,0,0,.4)",
                  pr: { xs: 0, md: 8 },
                  mt: 1,
                }}
              >
                {article.title}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* CONTENT */}
        <Box
          sx={{
            width: "100%",
            bgcolor: "background.default",
            borderTopLeftRadius: { xs: "16px", md: "24px" },
            borderTopRightRadius: { xs: "16px", md: "24px" },
            mt: { xs: -2, md: -4 },
            pb: { xs: 12, md: 14 },
          }}
        >
          <Container
            maxWidth={false}
            sx={{ px: { xs: 2, sm: 3, md: 4, lg: 10 } }}
          >
            <Grid container spacing={4} sx={{ pt: { xs: 4, md: 6 } }}>
              {/* Main Content Column */}
              <Grid size={{ xs: 12, lg: 8 }}>
                {/* Meta + Share */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 4,
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={3}
                    flexWrap="wrap"
                  >
                    <Box display="flex" alignItems="center" gap={1.25}>
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          color: "background.default",
                          width: 36,
                          height: 36,
                          fontWeight: 700,
                        }}
                      >
                        {blogHelpers.getAuthorName(article)[0] ?? "A"}
                      </Avatar>
                      <Typography
                        sx={{
                          fontFamily: "Bricolage",
                          color: "secondary.main",
                          fontWeight: 600,
                        }}
                      >
                        {blogHelpers.getAuthorName(article)}
                      </Typography>
                    </Box>

                    {/* Date */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <FiCalendar
                        size={18}
                        color={theme.palette.primary.main}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Bricolage",
                          color: "primary.main",
                        }}
                      >
                        {blogHelpers.formatPublishedDate(article)}
                      </Typography>
                    </Box>
                    {/* Time */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <FiClock size={18} color={theme.palette.primary.main} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Bricolage",
                          color: "primary.main",
                        }}
                      >
                        {blogHelpers.getReadingTime(article)} min read
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    onClick={handleShare}
                    startIcon={<FiShare2 />}
                    sx={{
                      color: "primary.main",
                      border: `1px solid ${theme.palette.primary.main}`,
                      borderRadius: "24px",
                      px: 2.5,
                      py: 1,
                      fontFamily: "Bricolage",
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "primary.main",
                        color: "background.default",
                      },
                    }}
                  >
                    Share
                  </Button>
                </Box>

                {/* Main Content */}
                {article.contentHtml ? (
                  renderBlogContent(article.contentHtml)
                ) : article.content ? (
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Bricolage",
                      color: "secondary.main",
                      fontSize: "1.125rem",
                      lineHeight: 1.9,
                      mb: 6,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {article.content}
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      border: `2px dashed ${theme.palette.primary.main}`,
                      borderRadius: "16px",
                      p: 4,
                      textAlign: "center",
                      mb: 6,
                      color: "primary.main",
                      fontFamily: "Bricolage",
                    }}
                  >
                    📝 Full blog content would appear here…
                  </Box>
                )}

                {/* Tags */}
                {chips.length > 0 && (
                  <Box mb={4}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Gliker",
                        color: "secondary.main",
                        mb: 1.5,
                      }}
                    >
                      Tags
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {chips.map((tag, i) => (
                        <Chip
                          key={i}
                          label={`#${tag}`}
                          sx={{
                            bgcolor: "secondary.main",
                            color: "background.default",
                            fontFamily: "Bricolage",
                            "&:hover": { bgcolor: "primary.main" },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <Box mb={4}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Gliker",
                        color: "secondary.main",
                        mb: 2,
                      }}
                    >
                      Related Articles
                    </Typography>
                    <Grid container spacing={2}>
                      {relatedArticles.map((related) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={related.id}>
                          <Link
                            href={blogHelpers.getArticleUrl(related)}
                            style={{ textDecoration: "none" }}
                          >
                            <Card
                              sx={{
                                height: "100%",
                                transition: "transform 0.2s",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                },
                              }}
                            >
                              {related.image && (
                                <Box
                                  sx={{
                                    position: "relative",
                                    width: "100%",
                                    height: 140,
                                  }}
                                >
                                  <Image
                                    src={related.image.url}
                                    alt={related.image.altText || related.title}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                                    loading="lazy"
                                  />
                                </Box>
                              )}
                              <CardContent>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontFamily: "Gliker",
                                    fontSize: "1rem",
                                    color: "secondary.main",
                                    mb: 1,
                                  }}
                                >
                                  {related.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontFamily: "Bricolage",
                                    color: "primary.main",
                                  }}
                                >
                                  {blogHelpers.getRelativeTime(related)}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Link>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* CTA */}
                <Box
                  sx={{
                    mt: 6,
                    pt: 4,
                    borderTop: `2px solid ${theme.palette.primary.main}`,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Gliker",
                      color: "secondary.main",
                      mb: 2.5,
                    }}
                  >
                    Explore More Stories
                  </Typography>
                  <Link href="/blogs" style={{ textDecoration: "none" }}>
                    <Button
                      sx={{
                        bgcolor: "primary.main",
                        color: "background.default",
                        fontFamily: "Bricolage",
                        fontSize: "1.05rem",
                        py: 1.3,
                        px: 3.6,
                        borderRadius: "26px",
                        textTransform: "none",
                        transition: "all .25s ease",
                        "&:hover": {
                          bgcolor: "secondary.main",
                          color: "background.default",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      View All Blogs
                    </Button>
                  </Link>
                </Box>
              </Grid>

              {/* Sticky Table of Contents - Right Column */}
              <Grid
                size={{ xs: 0, lg: 4 }}
                sx={{
                  display: { xs: "none", lg: "block" },
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "sticky",
                    top: "100px",
                    height: "fit-content",
                    maxHeight: "calc(100vh - 120px)",
                    overflowY: "auto",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "secondary.main",
                      color: "background.default",
                      borderRadius: 3,
                      p: 3,
                      boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Gliker",
                        fontWeight: 700,
                        mb: 2,
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                        pb: 1,
                      }}
                    >
                      Table of Contents
                    </Typography>
                    {tocItems.length > 0 ? (
                      <TocNavigation items={tocItems} />
                    ) : (
                      <Typography
                        sx={{
                          color: "background.default",
                          opacity: 0.7,
                          fontStyle: "italic",
                          fontSize: "0.9rem",
                        }}
                      >
                        No table of contents available
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Mobile Floating TOC Button */}
        <Box
          sx={{
            display: { xs: "block", lg: "none" },
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          {/* TOC Toggle Button */}
          <Box
            onClick={() => setTocOpen(!tocOpen)}
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "secondary.main",
              color: "background.default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.1)",
                backgroundColor: "primary.main",
              },
            }}
          >
            {tocOpen ? <FiX size={24} /> : <FiList size={24} />}
          </Box>

          {/* Expandable TOC Menu */}
          {tocOpen && (
            <Box
              sx={{
                position: "absolute",
                bottom: 70,
                right: 0,
                width: "280px",
                backgroundColor: "secondary.main",
                color: "background.default",
                borderRadius: 3,
                p: 3,
                boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                animation: "slideUp 0.3s ease",
                "@keyframes slideUp": {
                  from: {
                    opacity: 0,
                    transform: "translateY(20px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Gliker",
                  fontWeight: 700,
                  mb: 2,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  pb: 1,
                  fontSize: "1.1rem",
                }}
              >
                Table of Contents
              </Typography>
              <Box
                sx={{
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {tocItems.length > 0 ? (
                  <TocNavigation
                    items={tocItems}
                    isMobile={true}
                    onItemClick={() => setTocOpen(false)}
                  />
                ) : (
                  <Typography
                    sx={{
                      color: "background.default",
                      opacity: 0.7,
                      fontStyle: "italic",
                      fontSize: "0.9rem",
                      textAlign: "center",
                      py: 2,
                    }}
                  >
                    No table of contents available
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* Share fallback toast */}
        <Snackbar
          open={copiedOpen}
          autoHideDuration={2000}
          onClose={() => setCopiedOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setCopiedOpen(false)}
            severity="success"
            variant="filled"
            sx={{
              bgcolor: "primary.main",
              color: "background.default",
            }}
          >
            Link copied!
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
