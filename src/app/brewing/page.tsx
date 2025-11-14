import { Box, Stack, Typography, Grid } from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";

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
        sx={{
          position: "absolute",
          top: { xs: -320, sm: -400, md: -800 },
          left: 0,
          right: 0,
          width: { xs: 1250, sm: 1500, md: 2000 },
          height: { xs: 500, sm: 580, md: 600 },
          transform: "rotate(180deg)",
          zIndex: 2,
        }}
      >
        <Image
          src="/images/backgrounds/green_wave.png"
          alt="Green wave background"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 1250px, (max-width: 900px) 1500px, 2000px"
          loading="lazy"
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: -580, sm: -730, md: -900 },
          left: 0,
          right: 0,
          width: { xs: 1250, sm: 1500, md: 2000 },
          height: { xs: 630, sm: 780, md: 1000 },
        }}
      >
        <Image
          src="/images/backgrounds/beige_wave.png"
          alt="Beige wave background"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 1250px, (max-width: 900px) 1500px, 2000px"
          loading="lazy"
        />
      </Box>

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
          sx={{
            position: "relative",
            width: { xs: 100, sm: 150, md: 200 },
            height: { xs: 100, sm: 150, md: 200 },
            my: { xs: 2, sm: 4, md: 6 },
          }}
        >
          <Image
            src="/images/neko/playful.png"
            alt="Playful mascot"
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100px, (max-width: 900px) 150px, 200px"
            loading="lazy"
          />
        </Box>
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
                  sx={{
                    position: "relative",
                    width: { xs: 60, sm: 100, md: 130 },
                    height: { xs: 60, sm: 100, md: 130 },
                  }}
                >
                  <Image
                    src={step.image}
                    alt={`Step ${index + 1}`}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 60px, (max-width: 900px) 100px, 130px"
                    loading="lazy"
                  />
                </Box>
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
