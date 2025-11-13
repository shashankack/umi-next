"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import { searchProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify";
import { slugify } from "@/lib/slug";
import { alpha } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { FiArrowUpRight } from "react-icons/fi";

export default function SearchPage() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = (searchParams?.get("q") || "").trim();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(24);

  // Build related search terms: full phrase, tokens, simple singular/plural
  const searchTerms = useMemo(() => {
    if (!q) return [];
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    const set = new Set([q]);
    for (const t of tokens) {
      set.add(t);
      if (t.endsWith("s")) set.add(t.slice(0, -1));
      else set.add(`${t}s`);
    }
    return Array.from(set).slice(0, 6);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError("");
      setResults([]);
      setVisible(24);
      if (!q) return;
      try {
        setLoading(true);
        const allResults = await Promise.all(
          searchTerms.map((term) => searchProducts(term, 24))
        );
        const seen = new Set();
  const scored: (Product & { __score: number })[] = [];
  const pushList = (list: Product[], baseScore: number) => {
          (list || []).forEach((p, i) => {
            const key = (p.handle || p.id || p.title || "").toLowerCase();
            if (!key || seen.has(key)) return;
            seen.add(key);
            scored.push({ ...p, __score: baseScore + i });
          });
        };
        // Each result is a SearchConnection, so map to .edges[].node
  pushList(allResults[0]?.edges?.map((e) => e.node) || [], 0);
        allResults
          .slice(1)
          .forEach((conn, idx) =>
            pushList(
              conn?.edges?.map((e) => e.node) || [],
              (idx + 1) * 1000
            )
          );
        const merged = scored
          .sort((a, b) => a.__score - b.__score)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(({ __score, ...rest }) => rest);
        if (!cancelled) setResults(merged);
        if (!cancelled && merged.length === 0) setError("No products found.");
      } catch {
        if (!cancelled) setError("Search failed. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [q, searchTerms]);

  const resultCount = results.length;
  const visibleResults = useMemo(
    () => results.slice(0, visible),
    [results, visible]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="baseline" gap={2} mb={2} mt={14}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700 }}
          fontFamily={theme.typography.fontFamily}
          color={theme.palette.background.default}
        >
          {q ? `Results for  ${q}` : "Search"}
        </Typography>
      </Box>
      {loading && (
        <LinearProgress
          sx={{
            "& .MuiLinearProgress-bar": {
              backgroundColor: theme.palette.text.secondary,
            },
            bgcolor: alpha(theme.palette.background.default, 0.8),
          }}
        />
      )}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Grid container spacing={1}>
        {visibleResults.map((p) => (
          <Grid
            size={{ xs: 6, sm: 4, md: 3 }}
            key={p.id || p.handle || p.title}
          >
            <Card
              variant="outlined"
              sx={{
                position: "relative",
                borderRadius: 3,
                height: "100%",
                bgcolor: theme.palette.background.default,
                borderColor: theme.palette.primary.main,
                transition: "transform .15s ease, box-shadow .15s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  borderColor: theme.palette.text.secondary,
                  boxShadow: `2px 2px 0px ${theme.palette.text.secondary}`,
                },
                "& .arrow-icon": {
                  transition: "transform .3s ease",
                },
                "&:hover .arrow-icon": {
                  transform: "translate(4px, -4px)",
                },
              }}
            >
              <CardActionArea
                component="div"
                role="link"
                tabIndex={0}
                aria-label={`Open ${p.title}`}
                onClick={() => router.push(`/shop/${slugify(p.title)}`)}
                disableRipple
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/shop/${slugify(p.title)}`);
                  }
                }}
                sx={{
                  display: "block",
                  "&:focus-visible": {
                    outlineOffset: "2px",
                    borderRadius: 12,
                  },
                }}
              >
                {/* Media */}
                <Box
                  sx={{
                    position: "relative",
                    aspectRatio: "4 / 3",
                    overflow: "hidden",
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  {p.featuredImage?.url ? (
                    <Box
                      component="img"
                      src={p.featuredImage.url}
                      alt={p.title}
                      loading="lazy"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        transition: "transform .3s ease",
                        ".MuiCard-root:hover &": { transform: "scale(1.05)" },
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Typography variant="caption">No image</Typography>
                    </Box>
                  )}
                  {/* Quick add (appears on hover) */}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // TODO: quick add to cart here
                    }}
                    aria-label={`Add ${p.title} to cart`}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: theme.palette.text.secondary,
                      border: `1px solid ${theme.palette.text.secondary}`,
                      borderRadius: 2,
                      opacity: 0,
                      transform: "translateY(-6px)",
                      transition: "opacity .2s ease, transform .2s ease",
                      ".MuiCard-root:hover &": {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
                      "@media (hover: none)": {
                        opacity: 1,
                        transform: "none",
                        padding: "6px",
                        backdropFilter: "blur(4px)",
                      },
                      ".MuiCardActionArea-root:focus-visible & , .MuiCardActionArea-root:focus-within &":
                        {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                    }}
                  >
                    <ShoppingCartIcon fontSize="small" />
                  </IconButton>
                </Box>
                {/* Content */}
                <CardContent
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "center",
                    gap: 1.25,
                    py: 1.5,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    fontFamily={theme.typography.fontFamily}
                    color={theme.palette.text.secondary}
                    sx={{
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {p.title}
                  </Typography>
                  <FiArrowUpRight
                    fontSize={26}
                    color={theme.palette.primary.main}
                    className="arrow-icon"
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Load more / end state */}
      {!loading && q && resultCount > visible && (
        <Box textAlign="center" mt={3}>
          <Button
            variant="outlined"
            onClick={() => setVisible((v) => v + 24)}
            sx={{ borderRadius: 2 }}
          >
            Show more
          </Button>
          <Typography
            variant="caption"
            display="block"
            color="text.secondary"
            mt={1}
          >
            Showing {visibleResults.length} of {resultCount}
          </Typography>
        </Box>
      )}
      {!loading && q && resultCount === 0 && !error && (
        <Box textAlign="center" py={6}>
          <Typography color="text.secondary">
            No results. Try a different term.
          </Typography>
        </Box>
      )}
    </Container>
  );
}
