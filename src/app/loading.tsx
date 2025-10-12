import { Box, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      zIndex={4000}
    >
      <Box
        component="img"
        src="/images/neko/slider_thumb.png"
        sx={{
          width: { xs: 100, md: 150 },
          animation: `spin 2s linear infinite`,
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
      <Typography
        variant="body1"
        align="center"
        mt={4}
        sx={{ fontSize: { xs: 20, md: 30 } }}
      >
        Loading...
      </Typography>
    </Box>
  );
}
