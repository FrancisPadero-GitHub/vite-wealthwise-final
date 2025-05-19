import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.6rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.4rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.2rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.2rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1.2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.8rem",
      lineHeight: 1.43,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
});

export default theme;
