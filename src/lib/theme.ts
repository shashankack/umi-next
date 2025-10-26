import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#F6A09E",
    },
    secondary: {
      main: "#B5D782",
    },
    background: {
      default: "#FDF8CE",
    },
    text: {
      primary: "#B5D782",
      secondary: "#F6A09E",
    },
  },
  typography: {
    fontFamily: "Bricolage",

    h1: {
      fontFamily: "Gliker",
      fontWeight: 700,
    },

    h6: {
      fontFamily: "Genty",
    },
  },
});
