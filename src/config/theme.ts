import { createTheme, ThemeOptions } from "@mui/material/styles";
import { elGR } from "@mui/material/locale"; // Greek locale

// Custom color palette for Legal SaaS
const palette = {
  primary: {
    main: "#1976d2", // Professional blue
    light: "#42a5f5",
    dark: "#1565c0",
    contrastText: "#fff",
  },
  secondary: {
    main: "#424242", // Dark gray
    light: "#6d6d6d",
    dark: "#1b1b1b",
    contrastText: "#fff",
  },
  error: {
    main: "#d32f2f",
  },
  warning: {
    main: "#ed6c02",
  },
  success: {
    main: "#2e7d32",
  },
  background: {
    default: "#f5f5f5",
    paper: "#ffffff",
  },
};

const typography = {
  fontFamily: ['"Roboto"', '"Helvetica"', '"Arial"', "sans-serif"].join(","),
  h1: {
    fontWeight: 600,
  },
  h2: {
    fontWeight: 600,
  },
  h3: {
    fontWeight: 600,
  },
  h4: {
    fontWeight: 600,
  },
  h5: {
    fontWeight: 600,
  },
  h6: {
    fontWeight: 600,
  },
};

const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none" as const, // No uppercase buttons
        borderRadius: 8,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      head: {
        fontWeight: 600,
        backgroundColor: "#f5f5f5",
      },
    },
  },
};

const themeOptions: ThemeOptions = {
  palette,
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
};

export const lightTheme = createTheme(themeOptions, elGR);

// Optional dark theme
export const darkTheme = createTheme(
  {
    ...themeOptions,
    palette: {
      mode: "dark",
      ...palette,
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
    },
  },
  elGR
);
