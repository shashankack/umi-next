import Link from "next/link";
import { Stack, Box, Typography, IconButton } from "@mui/material";

import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PinterestIcon from "@mui/icons-material/Pinterest";

export default function Footer() {
  const navLinks = [
    [
      { title: "FAQ", path: "/faq" },
      { title: "Shop", path: "/shop" },
      { title: "Story", path: "/story" },
      { title: "Contact", path: "/contact" },
      { title: "Our Matcha", path: "/our-matcha" },
    ],
    [
      { title: "Blogs", path: "/blogs" },
      { title: "Refund Policy", path: "/refund-policy" },
      { title: "Privacy Policy", path: "/privacy-policy" },
      { title: "Shipping Policy", path: "/shipping-policy" },
      { title: "Terms of service", path: "/terms-of-service" },
    ],
    [
      {
        title: "Instagram",
        path: "https://www.instagram.com/umimatchaclub",
        logo: <InstagramIcon />,
      },
      {
        title: "Whatsapp",
        path: "https://wa.me/9568480048",
        logo: <WhatsAppIcon />,
      },
      {
        title: "Pinterest",
        path: "https://pin.it/5YQInpBIg",
        logo: <PinterestIcon />,
      },
    ],
  ];

  const LinkStyles = {
    color: "text.secondary",
    mb: 1,
    fontSize: { xs: 12, md: "1.6vw", xl: "1.2vw" },
    transition: "all 0.3s ease",
    "&:hover": {
      color: "text.primary",
      letterSpacing: "1px",
    },
  };

  const socialLinkStyles = {
    color: "background.default",
    bgcolor: "secondary.main",
    transition: "all 0.3s ease",
    p: { xs: 0.5, md: 1 },
    "& svg": { fontSize: { xs: 18, md: 30 } },

    "&:hover": {
      bgcolor: "secondary.main",
      transform: "scale(1.1) rotate(10deg)",
    },
  };

  return (
    <>
      <Stack
        py={{ xs: 2, md: 4 }}
        bgcolor="background.default"
        justifyContent="space-around"
        alignItems="stretch"
        direction="row"
        position="relative"
      >
        <Box
          component="img"
          src="/images/vectors/whisk.svg"
          sx={{
            bottom: { xs: "-7%", md: -50 },
            right: { xs: "10%", md: "10%" },
            width: { xs: "20vw", md: "20vw", lg: "10vw" },
            position: "absolute",
          }}
        />

        {/* Left */}
        <Stack
          justifyContent="space-between"
          alignItems="center"
          gap={{ xs: 2, md: 4 }}
        >
          <Box
            component="img"
            src="/images/icons/pink_monogram.png"
            width={{ xs: 80, md: 140 }}
          />
          <Box
            component="img"
            src="/images/vectors/bowl.svg"
            width={{ xs: 80, md: 140 }}
          />
          <Typography
            sx={{
              color: "text.secondary",
              textAlign: "center",
              fontSize: { xs: 10, md: "1.2vw" },
            }}
          >
            Kinder rituals that <br />
            fill your cup
          </Typography>
        </Stack>

        {/* Center */}
        <Stack justifyContent="space-between">
          <Stack>
            {navLinks[0].map((link, index) => (
              <Link
                key={index}
                href={link.path}
                style={{ textDecoration: "none" }}
              >
                <Typography variant="body1" sx={LinkStyles}>
                  {link.title}
                </Typography>
              </Link>
            ))}
          </Stack>
          <Stack direction="row" gap={{ xs: 0.5, md: 2 }}>
            {navLinks[2].map((link, index) => (
              <Link
                key={index}
                href={link.path}
                style={{ textDecoration: "none" }}
              >
                {"logo" in link && (
                  <IconButton sx={socialLinkStyles} aria-label={link.title}>
                    {link.logo}
                  </IconButton>
                )}
              </Link>
            ))}
          </Stack>
        </Stack>

        <Stack justifyContent="space-between">
          <Stack>
            {navLinks[1].map((link, index) => (
              <Link
                key={index}
                href={link.path}
                style={{ textDecoration: "none" }}
              >
                <Typography variant="body1" sx={LinkStyles}>
                  {link.title}
                </Typography>
              </Link>
            ))}
          </Stack>
        </Stack>
      </Stack>
      <Box width="100%" textAlign="center" py={2} bgcolor="background.default">
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 1,
            fontSize: { xs: 12, md: "1.2vw" },
          }}
        >
          © 2025 Umi. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}
