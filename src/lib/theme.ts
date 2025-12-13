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
    fontFamily: '"Bricolage", "Arial", sans-serif',

    h1: {
      fontFamily: '"Gliker", "Bricolage", "Arial", sans-serif',
      fontWeight: 700,
    },

    h6: {
      fontFamily: '"Genty", "Bricolage", "Arial", sans-serif',
    },
  },
});
