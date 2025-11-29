import Link from "next/link";
import { Stack, Box, Typography, IconButton } from "@mui/material";
import Image from "next/image";

import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PinterestIcon from "@mui/icons-material/Pinterest";
import { SiSubstack } from "react-icons/si";

export default function Footer() {
  const navLinks = [
    [
      { title: "FAQ", path: "/faq" },
      { title: "Shop", path: "/shop" },
      { title: "Story", path: "/about" },
      { title: "Contact", path: "/contact" },
      { title: "Farm to Foam", path: "/farm-to-foam" },
    ],
    [
      { title: "Blogs", path: "/blogs" },
      { title: "Refund Policy", path: "/policies/refund-policy" },
      { title: "Privacy Policy", path: "/policies/privacy-policy" },
      { title: "Shipping Policy", path: "/policies/shipping-policy" },
      { title: "Terms of service", path: "/policies/terms-of-service" },
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
      {
        title: "Substack",
        path: "https://substack.com/@umimatcha?r=6sb5u5&utm_medium=ios&utm_source=profile",
        logo: <SiSubstack />,
      },
    ],
  ];

  const LinkStyles = {
    color: "text.secondary",
    mb: 1,
    fontSize: { xs: 10, md: "1.6vw", lg: "1.2vw", xl: "1.2vw" },
    transition: "all 0.3s ease",
    "&:hover": {
      color: "text.primary",
      transform: "scale(1.05)",
    },
  };

  const socialLinkStyles = {
    color: "background.default",
    bgcolor: "secondary.main",
    transition: "all 0.3s ease",
    p: { xs: 0.5, md: 1 },
    "& svg": { fontSize: { xs: 16, md: 18, lg: 20, xl: 30 } },

    "&:hover": {
      bgcolor: "secondary.main",
      transform: "scale(1.1) rotate(10deg)",
    },
  };

  return (
    <>
      <Stack
        py={{ xs: 2, md: 2 }}
        bgcolor="background.default"
        justifyContent="space-around"
        alignItems="stretch"
        direction="row"
        position="relative"
      >
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: "0%", sm: "-10%", md: 0 },
            right: { xs: "5%", md: "10%" },
            width: {
              xs: "18vw",
              sm: "15vw",
              md: "12vw",
              lg: "10vw",
              xl: "8vw",
            },
            height: {
              xs: "18vw",
              sm: "15vw",
              md: "12vw",
              lg: "10vw",
              xl: "8vw",
            },
          }}
        >
          <Image
            src="/images/vectors/whisk.png"
            alt="Whisk decoration"
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 16vw, (max-width: 1024px) 16vw, 10vw"
            loading="lazy"
          />
        </Box>

        {/* Left */}
        <Stack
          justifyContent="space-between"
          alignItems="center"
          gap={{ xs: 0, md: 2 }}
        >
          <Box
            sx={{
              position: "relative",
              width: { xs: 60, md: 100, lg: 100, xl: 120 },
              height: { xs: 60, md: 100, lg: 100, xl: 120 },
              mb: -2,
            }}
          >
            <Image
              src="/images/icons/pink_monogram.png"
              alt="Umi monogram"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 60px, 140px"
              loading="lazy"
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              width: { xs: 60, md: 100, lg: 100, xl: 120 },
              height: { xs: 60, md: 100, lg: 100, xl: 120 },
            }}
          >
            <Image
              src="/images/vectors/bowl.svg"
              alt="Bowl decoration"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 60px, 140px"
              loading="lazy"
            />
          </Box>
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
        <Stack justifyContent="start" spacing={{ xs: 2, md: 4 }}>
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
          <Stack direction="row" gap={{ xs: 0.5, md: 1, lg: 1 }}>
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

        {/* Right */}
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
      <Box
        width="100%"
        textAlign="center"
        pb={{ xs: 2, md: 2 }}
        pt={{ xs: 2, md: 0 }}
        bgcolor="background.default"
      >
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontSize: { xs: 9, md: "1.2vw" },
          }}
        >
          © 2025 Umi. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}
