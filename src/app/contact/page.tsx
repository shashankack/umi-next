import { Box, Button, Stack, Typography } from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch",
  description:
    "Your Matcha Moments Matter to us. Contact Umi Matcha for inquiries about our organic Japanese matcha. Reach us via WhatsApp, Instagram, or email.",
  keywords: [
    "contact Umi Matcha",
    "matcha customer service",
    "buy matcha India",
    "matcha inquiries",
    "matcha support",
  ],
  openGraph: {
    title: "Contact Us - Get in Touch | Umi Matcha",
    description:
      "Your Matcha Moments Matter to us. Contact Umi Matcha for inquiries about our organic Japanese matcha.",
    type: "website",
  },
};

export default function ContactPage() {
  const linkStyles = {
    backgroundColor: "primary.main",
    color: "background.default",
    fontFamily: "Bricolage",
    fontSize: { xs: 16, md: 24 },
    boxShadow: "4px 4px 0 #B5D782",
    borderRadius: { xs: 2, md: 4 },
    textTransform: "lowercase",
    transition: "all 0.3s ease",

    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "6px 6px 0 #B5D782",
      backgroundColor: "primary.main",
    },
  };

  return (
    <Stack alignItems="center" pt={{ xs: 20, md: 22 }} pb={{ xs: 10, md: 20 }}>
      <Stack
        position="relative"
        width={{ xs: 330, sm: 600, md: 1000 }}
        alignItems="center"
      >
        <Box
          width={{ xs: "65%", md: "55%" }}
          bgcolor="background.default"
          borderRadius={{ xs: "30px 30px 0 0", md: "200px 200px 0 0" }}
          boxShadow="6px 0 0 #F6A09E"
        >
          <Typography
            variant="h6"
            sx={{
              transform: { xs: "translateY(20%)", md: "translateY(30%)" },
              color: "text.secondary",
              fontSize: { xs: 35, sm: 40, md: 70 },
              textAlign: "center",
              width: "100%",
              fontWeight: 200,
            }}
          >
            Contact us
          </Typography>
        </Box>
        <Stack
          width="100%"
          bgcolor="background.default"
          alignItems="center"
          borderRadius={{ xs: 3, md: 10 }}
          boxShadow="6px 6px 0 #F6A09E"
        >
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: { xs: 18, md: 32 },
              textAlign: "center",
              width: { xs: "60%", md: "100%" },
              fontWeight: 500,
              mt: { xs: 4, md: 6 },
            }}
          >
            Your Matcha Moments Matter to us
          </Typography>
          <Stack
            width="90%"
            // border="1px solid black"
            justifyContent={{ xs: "center", md: "space-between" }}
            direction={{ xs: "column-reverse", md: "row" }}
            px={{ xs: 2, md: 4 }}
            pt={{ xs: 4, md: 8 }}
            pb={{ xs: 6, md: 12 }}
            alignItems="center"
            spacing={{ xs: 4, md: 0 }}
          >
            <Stack
              spacing={{ xs: 2, md: 4 }}
              alignItems={{ xs: "center", md: "start" }}
            >
              <Button
                href="https://wa.me/9568480048"
                variant="contained"
                sx={linkStyles}
              >
                +91 9568480048
              </Button>
              <Button
                href="https://www.instagram.com/umimatchaclub"
                variant="contained"
                sx={linkStyles}
              >
                @umimatchaclub
              </Button>
              <Button
                variant="contained"
                href="mailto:hello@umimatchashop.com"
                sx={linkStyles}
              >
                hello@umimatchashop.com
              </Button>
            </Stack>

            <Box
              sx={{
                position: "relative",
                width: { xs: 100, md:  220 },
                height: { xs: 100, md: 220 },
                transform: {
                  xs: "rotateY(180deg) translateX(10%)",
                  md: "translateY(0)",
                },
              }}
            >
              <Image
                src="/images/neko/call.png"
                alt="Contact Us"
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 100px, 180px"
                loading="lazy"
              />
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
