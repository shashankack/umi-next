import { Box } from "@mui/material";

type CheckeredGridProps = {
  rows?: number;
  mobileColumns?: number;
  desktopColumns?: number;
  primaryColor?: string;
  secondaryColor?: string;
  squareSize?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
  };
  position?: "absolute" | "relative" | "fixed";
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  zIndex?: number;
};

export const CheckeredGrid = ({
  rows = 2,
  mobileColumns = 17,
  desktopColumns = 40,
  primaryColor = "secondary.main",
  secondaryColor = "background.default",
  squareSize = {
    xs: "7.14vw",
    sm: "4.6vw",
    md: "3.7vw",
    lg: "2.7vw",
  },
  position = "absolute",
  top = "auto",
  right = "auto",
  bottom = "auto",
  left = "auto",
  zIndex = 20,
}: CheckeredGridProps) => {
  const checkeredGrid = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    position,
    top,
    right,
    left,
    bottom,
    zIndex,

    checkeredRow: {
      display: "flex",
    },
    checkeredSquare: {
      width: squareSize,
      height: squareSize,
    },
  };

  return (
    <Box sx={checkeredGrid}>
      {[...Array(rows)].map((_, rowIdx) => (
        <Box key={rowIdx} sx={checkeredGrid.checkeredRow}>
          {/* Mobile squares (xs) */}
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            {[...Array(mobileColumns)].map((_, colIdx) => (
              <Box
                key={colIdx}
                sx={{
                  ...checkeredGrid.checkeredSquare,
                  backgroundColor:
                    (rowIdx + colIdx) % 2 === 0 ? primaryColor : secondaryColor,
                }}
              />
            ))}
          </Box>
          {/* Desktop squares (sm and up) */}
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {[...Array(desktopColumns)].map((_, colIdx) => (
              <Box
                key={colIdx}
                sx={{
                  ...checkeredGrid.checkeredSquare,
                  backgroundColor:
                    (rowIdx + colIdx) % 2 === 0 ? primaryColor : secondaryColor,
                }}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
