"use client";
import { Stack, Box, Link, Typography, useTheme } from "@mui/material";
import Image from "next/image";

export default function NotFound() {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.secondary,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 4, md: 0 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: "40vw", md: "20vw" },
          height: { xs: "40vw", md: "20vw" },
        }}
      >
        <Image
          src="/images/vectors/not_found.png"
          alt="404 Not Found"
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 768px) 40vw, 20vw"
          loading="lazy"
        />
      </Box>
      <Stack
        alignItems={{ xs: "center", md: "start" }}
        justifyContent={{ xs: "center", md: "start" }}
        ml={{ xs: 0, md: 10 }}
        gap={{ xs: 2, md: 4 }}
      >
        <Typography
          sx={{
            lineHeight: 0.8,
            fontFamily: theme.typography.h1?.fontFamily || theme.typography.fontFamily,
            fontSize: { xs: "12vw", md: "5vw" },
            "& span": { fontFamily: theme.typography.fontFamily },
          }}
        >
          Error <span>404</span>
        </Typography>
        <Typography
          sx={{
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.primary.main,
            textTransform: "capitalize",
            fontSize: { xs: "6vw", md: "2vw" },
          }}
        >
          matcha not found
        </Typography>
        <Link
          underline="none"
          href="/"
          sx={{
            textTransform: "uppercase",
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.background.default,
            fontSize: { xs: "4vw", md: "1vw" },
            bgcolor: theme.palette.text.secondary,
            transition: "all 0.3s ease",
            borderRadius: 1,
            padding: "12px 24px",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          Go home
        </Link>
      </Stack>
    </Stack>
  );
}
    