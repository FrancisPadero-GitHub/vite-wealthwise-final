import { createTheme } from "@mui/material/styles";

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // Light mode colors
            primary: {
              main: "#1976d2",
              light: "#42a5f5",
              dark: "#1565c0",
              contrastText: "#ffffff",
            },
            secondary: {
              main: "#9c27b0",
              light: "#ba68c8",
              dark: "#7b1fa2",
              contrastText: "#ffffff",
            },
            background: {
              default: "#f5f5f7",
              paper: "#ffffff",
            },
            text: {
              primary: "rgba(0, 0, 0, 0.87)",
              secondary: "rgba(0, 0, 0, 0.6)",
              disabled: "rgba(0, 0, 0, 0.38)",
            },
            action: {
              active: "rgba(0, 0, 0, 0.54)",
              hover: "rgba(0, 0, 0, 0.04)",
              selected: "rgba(0, 0, 0, 0.08)",
              disabled: "rgba(0, 0, 0, 0.26)",
              disabledBackground: "rgba(0, 0, 0, 0.12)",
            },
            divider: "rgba(0, 0, 0, 0.12)",
          }
        : {
            // Dark mode colors
            primary: {
              main: "#2e2e2e",
              light: "#3a3a3a",
              dark: "#1f1f1f",
              contrastText: "#ffffff",
            },
            secondary: {
              main: "#1f1f1f",
              light: "#2e2e2e",
              dark: "#141414",
              contrastText: "#ffffff",
            },
            background: {
              default: "#1f1f1f",
              paper: "#2e2e2e",
            },
            text: {
              primary: "#fff",
              secondary: "rgba(255, 255, 255, 0.7)",
              disabled: "rgba(255, 255, 255, 0.5)",
            },
            action: {
              active: "#fff",
              hover: "rgba(255, 255, 255, 0.08)",
              selected: "rgba(255, 255, 255, 0.16)",
              disabled: "rgba(255, 255, 255, 0.3)",
              disabledBackground: "rgba(255, 255, 255, 0.12)",
            },
            divider: "rgba(255, 255, 255, 0.12)",
          }),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor:
              mode === "dark" ? "#6b6b6b #2b2b2b" : "#6b6b6b #f5f5f5",
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              backgroundColor: mode === "dark" ? "#2b2b2b" : "#f5f5f5",
              width: 8,
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 8,
              backgroundColor: mode === "dark" ? "#6b6b6b" : "#6b6b6b",
              minHeight: 24,
            },
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#1e1e1e" : "#f5f5f5",
            "& .MuiTableCell-head": {
              color: mode === "dark" ? "#fff" : "rgba(0, 0, 0, 0.87)",
              fontWeight: 600,
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${
              mode === "dark"
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(0, 0, 0, 0.12)"
            }`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            color: mode === "dark" ? "#ffffff" : "inherit",
            "&:hover": {
              backgroundColor:
                mode === "dark" ? "#3a3a3a" : "rgba(0, 0, 0, 0.04)",
              color: mode === "dark" ? "#ffffff" : "#1976d2",
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
            "&:hover": {
              boxShadow:
                mode === "dark"
                  ? "0px 4px 20px rgba(0, 0, 0, 0.4)"
                  : "0px 4px 20px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#1e1e1e" : "#1976d2",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
            },
            "&.Mui-selected": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.16)"
                  : "rgba(0, 0, 0, 0.08)",
              "&:hover": {
                backgroundColor:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.24)"
                    : "rgba(0, 0, 0, 0.12)",
              },
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.23)"
                    : "rgba(0, 0, 0, 0.23)",
              },
              "&:hover fieldset": {
                borderColor:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.5)"
                    : "rgba(0, 0, 0, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: mode === "dark" ? "#ffffff" : "#1976d2",
                borderWidth: "2px",
              },
            },
            "& .MuiInputLabel-root": {
              color:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(0, 0, 0, 0.6)",
              "&.Mui-focused": {
                color: mode === "dark" ? "#ffffff" : "#1976d2",
              },
            },
            "& .MuiInputBase-input": {
              color: mode === "dark" ? "#ffffff" : "rgba(0, 0, 0, 0.87)",
            },
          },
        },
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: "2rem",
        fontWeight: 600,
      },
      h2: {
        fontSize: "1.75rem",
        fontWeight: 600,
      },
      h3: {
        fontSize: "1.5rem",
        fontWeight: 600,
      },
      h4: {
        fontSize: "1.25rem",
        fontWeight: 600,
      },
      h5: {
        fontSize: "1.1rem",
        fontWeight: 600,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 600,
      },
      body1: {
        fontSize: "0.875rem",
      },
      body2: {
        fontSize: "0.8125rem",
      },
      button: {
        fontSize: "0.875rem",
        textTransform: "none",
      },
    },
  });

export default getTheme;
