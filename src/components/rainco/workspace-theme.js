import { createTheme } from "@mui/material";
export const raincoMuiTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#EE1C25",
      dark: "#C81018",
      light: "#FF4D54",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#1E293B",
      dark: "#0F172A",
      light: "#334155",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#DC2626",
    },
    success: {
      main: "#16A34A",
    },
    warning: {
      main: "#D97706",
    },
    background: {
      default: "#F8F6F6",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1C1917",
      secondary: "#57534E",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, -apple-system, sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});
