"use client";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";

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
                component="img"
                src="/images/backgrounds/green_wave.png"
                sx={{
                  zIndex: 40,
                  width: "100vw",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Box width="50%">
              <Box
                component="img"
                src="/images/about_section.png"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <Box
              flex={1}
              bgcolor="background.default"
              p={{ md: 6, lg: 8, xl: 10 }}
            >
              <Box
                component="img"
                src="/images/our_matcha_title.png"
                sx={{
                  width: "24vw",
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { md: "1.1vw" },
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
              p={2}
              bgcolor="background.default"
              borderRadius={8}
              position="relative"
            >
              <Box
                component="img"
                src={"/images/vectors/founder_badge.png"}
                sx={{
                  position: "absolute",
                  width: 170,
                  top: "-12%",
                  left: "-15%",
                  animation: "umi-rotate 6s linear infinite",
                  "@keyframes umi-rotate": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                  },
                }}
              />

              <Box
                component="img"
                src="/images/founder.png"
                sx={{
                  borderRadius: 8,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Box width={"50%"} ml={15}>
              <Typography
                variant="body1"
                sx={{
                  color: "background.default",
                  fontSize: 22,
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
            component="img"
            src="/images/backgrounds/mobile_about.png"
            sx={{
              width: "100%",
              objectFit: "cover",
            }}
          />

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
              component="img"
              src="/images/backgrounds/green_wave.png"
              sx={{
                position: "absolute",
                top: "-5%",
                left: 0,
                right: 0,
                zIndex: 10,
                width: "175%",
                objectFit: "contain",
              }}
            />

            <Box
              p={1}
              bgcolor="background.default"
              borderRadius={6}
              position="relative"
              zIndex={20}
              border={1}
              borderColor="primary.main"
            >
              <Box
                component="img"
                src={"/images/vectors/founder_badge.png"}
                sx={{
                  position: "absolute",
                  width: 130,
                  top: "-7%",
                  left: "-10%",
                  animation: "umi-rotate 6s linear infinite",
                  "@keyframes umi-rotate": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                  },
                }}
              />

              <Box
                component="img"
                src="/images/founder.png"
                sx={{
                  borderRadius: 6,
                  width: "100%",
                  height: 350,
                  objectFit: "cover",
                }}
              />

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
