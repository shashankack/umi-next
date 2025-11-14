import { Box, Stack, Typography } from "@mui/material";

export const metadata = {
  title: "About",
  // Add other metadata as needed
};

export default function AboutPage() {
  return (
    <Stack pt={15} bgcolor="background.default">
      <Typography
        variant="h1"
        sx={{
          color: "primary.main",
          textShadow: "0.3px 2px 0 #B5D782",
          textAlign: "center",
          fontSize: { xs: "2.4rem", sm: "3rem", md: "4rem" },
          fontWeight: 700,
          letterSpacing: 1,
          mb: 2,
          mt: { xs: 6, md: 4 },
        }}
      >
        About Us
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mt: { xs: 2, md: 4 },
          px: { xs: 2, md: 10 },
          mb: { xs: 3, md: 5 },
          fontSize: { xs: "2.6vw", md: "1.2vw" },
          textAlign: "justify",
          color: { xs: "#000", md: "#000" },
        }}
      >
        Umi 海 comes from the Japanese word ocean.
        <br />
        <br />
        The concept of Umi is inspired by the famous Japanese painting,
        &quot;The Great Wave of Kanagawa&quot;. Matcha has been a constant in my
        life through its highest highs and lowest lows and just like that, the
        great wave depicts life&apos;s journey. It is a never-ending process
        where once we conquer our fear and meet our goal, we&apos;ll be met
        again with other vicious waves, other bigger problems & difficulties.
        <br />
        <br />
        However, our tiredness towards the journey will also have its sweetness
        when we reach a calm sea, where its wave is gentle, and we can feel the
        summer breeze warm our mind, body, and soul. But, with the knowledge
        that another wave is waiting to be conquered. Umi Matcha represents a
        symbolic shift within the matcha community. Life is always better with a
        matcha in hand. We are thrilled to have Umi become a part of your
        daily routine because it&apos;s truly the most magical part of ours.
      </Typography>

      <Box>
        <picture>
          <source
            srcSet="/images/backgrounds/about_mobile.png"
            media="(max-width: 768px)"
          />
          <img
            src="/images/backgrounds/about.png"
            alt="About"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </picture>
      </Box>
    </Stack>
  );
}
