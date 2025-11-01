import { Box, Stack, Typography, Grid } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brewing Guide - How to Make Matcha",
  description:
    "Learn how to brew perfect matcha the Umi way. Step-by-step guide for preparing delicious matcha lattes at home with our ceremonial grade matcha powder.",
  keywords: [
    "how to make matcha",
    "matcha brewing guide",
    "matcha preparation",
    "matcha latte recipe",
    "brewing matcha tea",
    "matcha instructions",
  ],
  openGraph: {
    title: "Brewing Guide - How to Make Matcha | Umi Matcha",
    description:
      "Learn how to brew perfect matcha the Umi way. Step-by-step guide for preparing delicious matcha lattes.",
    type: "website",
  },
};

export default function BrewingPage() {
  const steps = [
    {
      image: "/images/vectors/steps/step1.svg",
      desc: "Sift 2-3 tsp of <br />umi matcha into a bowl",
    },
    {
      image: "/images/vectors/steps/step2.svg",
      desc: "Add 60ml of warm water and whisk until smooth",
    },
    {
      image: "/images/vectors/steps/step3.svg",
      desc: "Pour milk of <br /> your choice",
    },
    {
      image: "/images/vectors/steps/step4.svg",
      desc: "Add sweetener of <br />  your choice",
    },
  ];

  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "start",
        bgcolor: "primary.main",
        pt: { xs: 25, md: 20 },
        pb: { xs: 10, md: 20 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src="/images/backgrounds/green_wave.png"
        sx={{
          width: { xs: 1250, sm: 1500, md: 2000 },
          transform: "rotate(180deg)",
          position: "absolute",
          top: { xs: -320, sm: -400, md: -800 },
          zIndex: 2,
        }}
      />
      <Box
        component="img"
        src="/images/backgrounds/beige_wave.png"
        sx={{
          width: { xs: 1250, sm: 1500, md: 2000 },
          position: "absolute",
          bottom: { xs: -550, sm: -670, md: -870 },
        }}
      />

      <Typography
        variant="h1"
        sx={{
          position: "relative",
          fontSize: { xs: 30, sm: 40, md: 70 },
          textAlign: "center",
          zIndex: 2,
          letterSpacing: 1,
        }}
      >
        Brew it the Umi way
      </Typography>

      <Stack alignItems="center">
        <Box
          component="img"
          src="/images/neko/playful.png"
          width={{ xs: 100, sm: 150, md: 200 }}
          position="relative"
          py={{ xs: 2, sm: 4, md: 6 }}
        />
        <Grid
          container
          width="100%"
          position="relative"
          spacing={{ xs: 3, md: 6 }}
        >
          {steps.map((step, index) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={index}>
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                height="100%"
              >
                <Box
                  component="img"
                  src={step.image}
                  width={{ xs: 60, sm: 100, md: 130 }}
                />
                <Typography
                  variant="body1"
                  textAlign="center"
                  fontWeight={500}
                  fontSize={{ xs: "3vw", md: "1vw" }}
                  dangerouslySetInnerHTML={{ __html: step.desc }}
                />
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
}
