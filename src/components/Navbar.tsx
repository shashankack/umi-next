"use client";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Stack,
  Badge,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import MenuDrawer from "@/components/drawers/MenuDrawer";
import CartDrawer from "@/components/drawers/CartDrawer";
import SearchDrawer from "@/components/drawers/SearchDrawer";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hideOnScroll, setHideOnScroll] = useState(false);
  const lastScrollY = useRef(0);
  const { itemCount } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Desktop submenu state with hover/focus timers
  const [shopAnchorEl, setShopAnchorEl] = useState<null | HTMLElement>(null);
  const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);

  const pathname = usePathname() || "";
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
      if (currentScrollY > scrollThreshold) {
        if (currentScrollY > lastScrollY.current) {
          setHideOnScroll(true);
        } else {
          setHideOnScroll(false);
        }
      } else {
        setHideOnScroll(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isTransparentPage]);

  const shouldBeTransparent = isTransparentPage && !isScrolled;

  // Shop submenu items (scroll to section)
  const shopSubmenu = [
    { label: "Matcha", handle: "matcha" },
    { label: "Matchaware", handle: "matchaware" },
    { label: "Bundles", handle: "bundles" },
  ];
  // More submenu items
  const moreSubmenu = [
    { label: "About", path: "/about" },
    { label: "Brewing", path: "/brewing" },
    { label: "Farm to Foam", path: "/farm-to-foam" },
    { label: "Blogs", path: "/blogs" },
  ];

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
          {/* Left: Desktop nav or menu button */}
          <Box flex={1} display="flex" alignItems="center">
            {!isMobile && (
              <Stack direction="row" alignItems="center" gap={2}>
                {/* Shop link with submenu */}
                <Box
                  position="relative"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Link
                    href="/shop"
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Gliker",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        color: "background.default",
                        px: 2,
                        py: 1,
                        cursor: "pointer",
                        position: "relative",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        userSelect: "none",
                        display: "inline-block",
                      }}
                      component="span"
                    >
                      Shop
                    </Typography>
                  </Link>
                  <IconButton
                    aria-label="Toggle Shop submenu"
                    aria-expanded={Boolean(shopAnchorEl)}
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShopAnchorEl(
                        shopAnchorEl ? null : (e.currentTarget as HTMLElement)
                      );
                    }}
                    sx={{
                      p: 0.5,
                      ml: -1,
                      mt: 0.5,
                      color: "background.default",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/vectors/dropdown.svg"
                      alt="Dropdown Arrow"
                      sx={{
                        width: 20,
                        height: 20,
                        transformOrigin: "center",
                        transform: shopAnchorEl
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={shopAnchorEl}
                    open={Boolean(shopAnchorEl)}
                    onClose={() => setShopAnchorEl(null)}
                    MenuListProps={{
                      sx: { bgcolor: "secondary.main", minWidth: 160 },
                    }}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    PaperProps={{ sx: { bgcolor: "secondary.main" } }}
                  >
                    {shopSubmenu.map((item) => (
                      <MenuItem
                        key={item.handle}
                        onClick={() => {
                          setShopAnchorEl(null);
                          // Scroll to section on /shop
                          if (window.location.pathname === "/shop") {
                            const el = document.getElementById(item.handle);
                            if (el) {
                              el.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            } else {
                              window.location.hash = `#${item.handle}`;
                            }
                          } else {
                            window.location.href = `/shop#${item.handle}`;
                          }
                        }}
                        sx={{
                          color: "background.default",
                          fontFamily: "Gliker",
                          fontWeight: 600,
                          fontSize: "1rem",
                          textTransform: "capitalize",
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
                {/* More link with submenu */}
                <Box
                  position="relative"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Gliker",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      color: "background.default",
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      position: "relative",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      userSelect: "none",
                      display: "inline-block",
                    }}
                    component="span"
                    onClick={(e) => {
                      setMoreAnchorEl(
                        moreAnchorEl ? null : (e.currentTarget as HTMLElement)
                      );
                    }}
                  >
                    More
                  </Typography>
                  <Menu
                    anchorEl={moreAnchorEl}
                    open={Boolean(moreAnchorEl)}
                    onClose={() => setMoreAnchorEl(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    slotProps={{
                      paper: {
                        sx: {
                          bgcolor: "secondary.main",
                        },
                      },
                    }}
                  >
                    {moreSubmenu.map((item) => (
                      <MenuItem
                        key={item.label}
                        onClick={() => {
                          setMoreAnchorEl(null);
                          window.location.href = item.path;
                        }}
                        sx={{
                          color: "background.default",
                          fontFamily: "Gliker",
                          fontWeight: 600,
                          fontSize: "1rem",
                          textTransform: "capitalize",
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
                {/* Contact link */}
                <Link href="/contact" style={{ textDecoration: "none" }}>
                  <Typography
                    sx={{
                      fontFamily: "Gliker",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      color: "background.default",
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      userSelect: "none",
                    }}
                  >
                    Contact
                  </Typography>
                </Link>
              </Stack>
            )}
            {isMobile && (
              <IconButton onClick={() => setMenuOpen(true)}>
                <Box
                  component="img"
                  src="/images/vectors/menu.svg"
                  alt="Menu Icon"
                  width={{ xs: 24, md: 30 }}
                />
              </IconButton>
            )}
          </Box>
          {/* Center: Logo */}
          <Box
            flexShrink={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
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
          </Box>
          {/* Right: Icons */}
          <Box flex={1} display="flex" justifyContent="flex-end" gap={1}>
            <IconButton onClick={() => setSearchOpen(true)}>
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
      {/* Mobile: Drawer for menu (unchanged) */}
      {isMobile && (
        <MenuDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          navLinks={[
            { title: "Home", path: "/" },
            { title: "Shop", path: "/shop", hasDropdown: true },
            { title: "About", path: "/about" },
            { title: "Brewing", path: "/brewing" },
            { title: "Farm to Foam", path: "/farm-to-foam" },
            { title: "Contact", path: "/contact" },
          ]}
        />
      )}
      {/* Search Drawer */}
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      {/* Cart Drawer (always available) */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </AppBar>
  );
}
