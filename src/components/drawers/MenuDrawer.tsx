import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export interface NavLink {
  title: string;
  path: string;
  hasDropdown?: boolean;
}

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({ open, onClose, navLinks }) => {
  const [showShopSubmenu, setShowShopSubmenu] = useState(false);

  // Define the shop categories that match your shop page sections
  const shopCategories = [
    { handle: "", title: "Matcha" },
    { handle: "matchaware", title: "Matchaware" },
    { handle: "bundles", title: "Bundles" },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          backgroundImage: `url(/images/backgrounds/navbar_bg.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: { xs: "103%", sm: "103%", md: 500 },
          ml: { xs: -1, sm: -2, md: 0 },
          height: "101vh",
          borderRadius: 0,
          boxShadow: "none",
          position: "relative",
          zIndex: 10,
        },
      }}
    >
      <Box
        component="img"
        src="/images/icons/beige_logo.png"
        alt="Logo"
        width={{ xs: 90, md: 130 }}
        sx={{
          position: "absolute",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 11,
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "transparent",
          height: "100vh",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ alignSelf: "flex-start", mt: 4, ml: 4 }}
        >
          <Box
            component="img"
            src="/images/vectors/close.svg"
            alt="Close Icon"
            width={{ xs: 24, md: 32 }}
          />
        </IconButton>

        <List
          sx={{
            width: "100%",
            mt: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {navLinks.map((link) => (
            <ListItem
              key={link.title}
              disablePadding
              sx={{ flexDirection: "column" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
                width="100%"
                position="relative"
              >
                <ListItemButton
                  component={Link}
                  href={link.path}
                  onClick={onClose}
                  sx={{
                    fontFamily: "Gliker",
                    textDecoration: "none",
                    color: "background.default",
                    fontWeight: 700,
                    fontSize: { xs: "1.8rem", md: "2rem" },
                    justifyContent: "center",
                    py: 1,
                  }}
                >
                  {link.title}
                </ListItemButton>

                {link.hasDropdown && (
                  <IconButton
                    aria-label="Toggle Shop submenu"
                    aria-expanded={showShopSubmenu}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowShopSubmenu((prev) => !prev);
                    }}
                    sx={{
                      position: "absolute",
                      p: 0.5,
                      mr: -1,
                      top: 15,
                      right: { xs: "33%", sm: "40%", md: "35%" },
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/vectors/dropdown.svg"
                      alt=""
                      sx={{
                        width: 20,
                        height: 20,
                        transformOrigin: "center",
                        transform: showShopSubmenu
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </IconButton>
                )}
              </Box>

              {/* Collapsible Shop submenu */}
              {link.title === "Shop" && (
                <Collapse in={showShopSubmenu} timeout="auto" unmountOnExit>
                  <Box mt={1} width="100%" textAlign="center">
                    {shopCategories.map((cat) => (
                      <Link
                        key={cat.handle}
                        href={`/shop#${cat.handle}`}
                        onClick={onClose}
                        style={{ textDecoration: "none" }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Gliker",
                            fontSize: "1.4rem",
                            textTransform: "capitalize",
                            fontWeight: 700,
                            color: "background.default",
                            display: "block",
                            py: 0.5,
                            cursor: "pointer",
                            borderBottom: "1px solid",
                            borderColor: "secondary.main",
                            "&:first-of-type": {
                              borderTop: "1px solid",
                              borderTopColor: "secondary.main",
                            },
                          }}
                        >
                          {cat.title}
                        </Typography>
                      </Link>
                    ))}
                  </Box>
                </Collapse>
              )}
            </ListItem>
          ))}
        </List>
        <Box
          mx="auto"
          component="img"
          src="/images/neko/neko.gif"
          width={160}
        />
      </Box>
    </Drawer>
  );
};

export default MenuDrawer;
