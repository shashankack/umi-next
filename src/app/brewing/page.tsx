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
      desc: "Sift 2-3 tsp of umi matcha into a bowl",
    },
    {
      image: "/images/vectors/steps/step2.svg",
      desc: "Add 60ml of warm water and whisk until smooth",
    },
    {
      image: "/images/vectors/steps/step3.svg",
      desc: "Pour milk of your choice",
    },
    {
      image: "/images/vectors/steps/step4.svg",
      desc: "Add sweetener of your choice",
    },
  ];

  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "start",
        bgcolor: "background.default",
        pt: { xs: 18, md: 20 },
        pb: { xs: 20, md: 30 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src="/images/backgrounds/pink_wave.png"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "rotate(180deg)",
          position: "absolute",
          zIndex: 0,
          top: { xs: -100, sm: -80, md: -50 },
        }}
      />

      <Typography
        variant="h1"
        sx={{
          position: "relative",
          fontSize: { xs: 30, sm: 50, md: 80 },
          textAlign: "center",
          fontWeight: 600,
          zIndex: 2,
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
          pt={{ xs: 2, sm: 4, md: 6 }}
        />
        <Grid container width="100%" position="relative" spacing={1}>
          {steps.map((step, index) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={index}>
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="space-evenly"
                height="100%"
              >
                <Box
                  component="img"
                  src={step.image}
                  width={{ xs: 60, sm: 100, md: 150 }}
                />
                <Typography
                  variant="body1"
                  textAlign="center"
                  fontWeight={500}
                  width={{ xs: "80%", md: "60%" }}
                  fontSize={{ xs: "3vw", md: "1.2vw" }}
                >
                  {step.desc}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
}
