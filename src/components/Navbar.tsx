"use client";
import { AppBar, Box, IconButton, Toolbar, Stack, Badge } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import MenuDrawer from "@/components/drawers/MenuDrawer";
import CartDrawer from "@/components/drawers/CartDrawer";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hideOnScroll, setHideOnScroll] = useState(false);
  const lastScrollY = useRef(0);

  const { itemCount } = useCart();

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Shop", path: "/shop", hasDropdown: true },
    { title: "About", path: "/about" },
    { title: "Brewing", path: "/brewing" },
    { title: "Farm to Foam", path: "/farm-to-foam" },
    { title: "Contact", path: "/contact" },
  ];

  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isArticlePage =
    pathname.startsWith("/blogs/") && pathname.split("/").length === 4;
  const isTransparentPage = isHomePage || isArticlePage;

  useEffect(() => {
    setMounted(true);

    const scrollThreshold = isTransparentPage ? 600 : 80;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > scrollThreshold);

      // Only hide after threshold
      if (currentScrollY > scrollThreshold) {
        if (currentScrollY > lastScrollY.current) {
          setHideOnScroll(true); // scrolling down
        } else {
          setHideOnScroll(false); // scrolling up
        }
      } else {
        setHideOnScroll(false); // always show before threshold
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isTransparentPage]);

  // Use consistent styling for SSR and initial client render
  const shouldBeTransparent = isTransparentPage && !isScrolled;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: shouldBeTransparent ? "transparent" : "secondary.main",
        transition: mounted ? "background-color 0.3s, transform 0.3s" : "none",
        px: { xs: 0, md: 3 },
        py: { xs: 4, md: 2 },
        transform: hideOnScroll ? "translateY(-110%)" : "translateY(0)",
      }}
    >
      <Toolbar>
        <Stack
          direction="row"
          alignItems="center"
          width="100%"
          justifyContent="space-between"
        >
          <Box flex={1}>
            <IconButton onClick={() => setMenuOpen(true)}>
              <Box
                component="img"
                src="/images/vectors/menu.svg"
                alt="Menu Icon"
                width={{ xs: 24, md: 30 }}
              />
            </IconButton>
          </Box>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Box
              component="img"
              src="/images/icons/beige_logo.png"
              alt="Logo"
              width={{ xs: 80, md: 110 }}
              sx={{
                transition: "all 0.2s ease",
                opacity: menuOpen ? 0 : 1,

                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Link>
          <Box flex={1} display="flex" justifyContent="flex-end" gap={1}>
            <IconButton>
              <Box
                component="img"
                src="/images/vectors/search.svg"
                alt="Search Icon"
                width={{ xs: 24, md: 30 }}
              />
            </IconButton>
            <IconButton onClick={() => setCartOpen(true)}>
              <Badge
                badgeContent={itemCount}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "text.secondary",
                    color: "background.default",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  },
                }}
              >
                <Box
                  component="img"
                  src="/images/vectors/cart.svg"
                  alt="Cart Icon"
                  width={{ xs: 24, md: 30 }}
                />
              </Badge>
            </IconButton>
          </Box>
        </Stack>
      </Toolbar>
      {/* Left Drawer for menu */}
      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navLinks={navLinks}
      />
      {/* Right Drawer for cart */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </AppBar>
  );
}
