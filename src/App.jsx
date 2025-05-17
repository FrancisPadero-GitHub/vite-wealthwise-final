import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";

import Footer from "./app/structure/Footer";
import Sidebar from "./app/structure/Sidebar";
import Topbar from "./app/structure/Topbar";

import SignIn from "./app/auth/SignIn";
import SignUp from "./app/auth/SignUp";

import ProtectedRoute from "./app/components/ProtectedRoutes";
import { AuthProvider } from "./contexts/AuthProvider";

import Dashboard from "./app/components/Dashboard";
import Profile from "./app/components/Profile";
import Transactions from "./app/components/Transactions";

import { darkTheme, lightTheme } from "./theme"; // import themes

const queryClient = new QueryClient();
const drawerWidth = 240;

function Layout({ toggleTheme, isDark }) {
  const [open, setOpen] = useState(true);

  const handleToggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <CssBaseline />
      <Topbar
        onDrawerToggle={handleToggleDrawer}
        onThemeToggle={toggleTheme}
        isDark={isDark}
      />
      <Sidebar open={open} />
      <Box
        component="main"
        sx={{
          transition: "margin 0.3s",
          marginLeft: open ? `${drawerWidth}px` : 0,
          padding: 3,
          marginTop: "64px",
          minHeight: "calc(100vh - 64px - 48px)",
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}

function App() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useState(prefersDark);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);
  
  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "/",
          element: (
            <ProtectedRoute>
              <Layout toggleTheme={toggleTheme} isDark={isDark} />
            </ProtectedRoute>
          ),
          children: [
            { path: "/", element: <Dashboard /> },
            { path: "/profile", element: <Profile /> },
            { path: "/transactions", element: <Transactions /> },
          ],
        },
        {
          path: "/login",
          element: <SignIn />,
        },
        {
          path: "/register",
          element: <SignUp />,
        },
      ]),
    [toggleTheme, isDark]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
