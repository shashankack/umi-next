"use client";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";

export const AboutSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack overflow={"hidden"}>
      <Box height={{ xs: 40, md: 60 }} bgcolor="primary.main"></Box>

      {!isMobile && (
        <Stack overflow="hidden">
          <Stack direction="row" position="relative" overflow="hidden">
            <Box
              height={"10vw"}
              overflow="hidden"
              sx={{
                position: "absolute",
                bottom: -0,
                left: 0,
                right: 0,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100vw",
                  height: { md: 600, lg: 800 },
                  bottom: { md: "-50%", lg: "-50%" },
                }}
              >
                <Image
                  src="/images/backgrounds/green_wave.png"
                  alt="Green wave background"
                  fill
                  sizes="100vw"
                  style={{ objectFit: "cover", zIndex: 400 }}
                  loading="lazy"
                />
              </Box>
            </Box>
            <Box
              width="50vw"
              sx={{
                position: "relative",
                height: { xs: 300, sm: 400, md: 500, lg: 600, xl: 800 },
              }}
            >
              <Image
                src="/images/about_section.webp"
                alt="About Umi Matcha"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
            </Box>
            <Box
              flex={1}
              bgcolor="background.default"
              p={{ md: 6, lg: 8, xl: 10 }}
            >
              <Box sx={{ position: "relative", width: "100%", height: "auto" }}>
                <Image
                  src="/images/our_matcha_title.png"
                  alt="Our Matcha"
                  width={800}
                  height={200}
                  style={{ width: "100%", height: "auto" }}
                  sizes="(max-width: 1200px) 40vw, 35vw"
                  loading="lazy"
                />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  mt: 6,
                  color: "text.secondary",
                  fontSize: { md: "1.2vw" },
                  textAlign: "justify",
                  fontWeight: 500,
                }}
              >
                At Umi, we take our matcha seriously, like hillside farms in
                Japan seriously. We partner up exclusively with certified
                organic farms in Japan, where matcha is cultivated with care,
                free from pesticides and harmful additives. Our matcha is
                harvested during the spring 1st flush from Japan’s most renowned
                matcha growing regions. Grown with care, it’s 100% organic, free
                from pesticides and synthetic additives which retains its
                natural purity and vibrant green color.
              </Typography>
            </Box>
          </Stack>

          <Stack
            sx={{
              position: "relative",
              zIndex: 20,
              justifyContent: "start",
              alignItems: "center",
              pt: 0,
              pb: 10,
              pl: 20,
              flexDirection: "row",
            }}
          >
            <Box
              width={400}
              mt={7}
              p={2}
              bgcolor="background.default"
              borderRadius={8}
              position="relative"
            >
              <Box
                sx={{
                  position: "absolute",
                  width: 170,
                  top: "-15%",
                  left: "-15%",
                  zIndex: 100,
                  animation: "umi-rotate 6s linear infinite",
                  "@keyframes umi-rotate": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                  },
                }}
              >
                <Image
                  src="/images/vectors/founder_badge.png"
                  alt="Founder badge"
                  width={170}
                  height={170}
                  sizes="170px"
                  style={{ width: "100%", height: "auto" }}
                  loading="lazy"
                />
              </Box>

              <Box
                sx={{
                  borderRadius: 8,
                  position: "relative",
                  width: "100%",
                  height: 500,
                }}
              >
                <Image
                  src="/images/founder.webp"
                  alt="Umi Matcha Founder"
                  fill
                  sizes="(max-width: 768px) 200px, 300px"
                  style={{ objectFit: "cover", borderRadius: 32 }}
                  loading="lazy"
                />
              </Box>
            </Box>

            <Box width={"50%"} ml={15}>
              <Typography
                variant="body1"
                sx={{
                  color: "background.default",
                  fontSize: { md: "1.2vw" },
                  textAlign: "justify",
                }}
              >
                “Umi was born out of my deep love for matcha and Japan. I’ve
                been a matcha consumer since 2019, and during my travels to
                Japan, I had the opportunity of experiencing authentic matcha
                that completely changed the way I saw this beautiful tea. I
                founded Umi to bring that same quality, authenticity, and
                connection back home to India, something beyond the grades and
                the mass-produced matcha that’s sold here.”
                <br />
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    textAlign: "right",
                    mt: 2,
                  }}
                >
                  - Adviti
                </Box>
              </Typography>
            </Box>
          </Stack>
        </Stack>
      )}

      {isMobile && (
        <Stack>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              zIndex: 10,
              height: { xs: 220, sm: 350, md: 400 },
            }}
          >
            <Image
              src="/images/backgrounds/mobile_about.png"
              alt="About Umi Matcha mobile"
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
          </Box>

          <Box bgcolor="primary.main" pt={3} px={2} pb={10}>
            <Typography
              variant="body1"
              sx={{
                color: "background.default",
                fontSize: 14,
                textAlign: "justify",
                fontWeight: 500,
              }}
            >
              At Umi, we take our matcha seriously, like hillside farms in Japan
              seriously. We partner up exclusively with certified organic farms
              in Japan, where matcha is cultivated with care, free from
              pesticides and harmful additives. Our matcha is harvested during
              the spring 1st flush from Japan’s most renowned matcha growing
              regions. Grown with care, it’s 100% organic, free from pesticides
              and synthetic additives which retains its natural purity and
              vibrant green color.
            </Typography>
          </Box>

          <Stack direction="row" p={4} position="relative">
            <Box
              sx={{
                position: "absolute",
                top: "-5%",
                left: 0,
                right: 0,
                zIndex: 10,
                width: "175%",
                height: "auto",
              }}
            >
              <Image
                src="/images/backgrounds/green_wave.png"
                alt="Green wave decoration"
                width={1400}
                height={200}
                style={{ width: "100%", height: "auto" }}
                sizes="175vw"
                loading="lazy"
              />
            </Box>

            <Box
              p={1}
              bgcolor="background.default"
              borderRadius={6}
              position="relative"
              zIndex={20}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: 130,
                  height: 130,
                  top: "-7%",
                  left: "-10%",
                  zIndex: 100,
                  animation: "umi-rotate 6s linear infinite",
                  "@keyframes umi-rotate": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                  },
                }}
              >
                <Image
                  src="/images/vectors/founder_badge.png"
                  alt="Founder badge"
                  width={130}
                  height={130}
                  loading="lazy"
                />
              </Box>

              <Box
                sx={{
                  borderRadius: 6,
                  position: "relative",
                  width: "100%",
                  height: 350,
                }}
              >
                <Image
                  src="/images/founder.webp"
                  alt="Umi Matcha Founder"
                  fill
                  style={{ objectFit: "cover", borderRadius: 24 }}
                  sizes="(max-width: 768px) 90vw, 400px"
                  loading="lazy"
                />
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: "#000",
                  mt: 2,
                  textAlign: "justify",
                  fontSize: 12,
                  px: 1,
                }}
              >
                “Umi was born out of my deep love for matcha and Japan. I’ve
                been a matcha consumer since 2019, and during my travels to
                Japan, I had the opportunity of experiencing authentic matcha
                that completely changed the way I saw this beautiful tea. I
                founded Umi to bring that same quality, authenticity, and
                connection back home to India, something beyond the grades and
                the mass-produced matcha that’s sold here.”
                <br />
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    textAlign: "right",
                    mt: 1,
                    fontSize: 14,
                  }}
                >
                  - Adviti
                </Box>
              </Typography>
            </Box>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
