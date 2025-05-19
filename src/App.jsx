import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Box, ThemeProvider } from "@mui/material";
import theme from "./theme";

import Footer from "./app/structure/Footer";
import Sidebar from "./app/structure/Sidebar";
import Topbar from "./app/structure/Topbar";

import SignIn from "./app/auth/SignIn";
import SignUp from "./app/auth/SignUp";

import ProtectedRoute from "./app/components/ProtectedRoutes";
import { AuthProvider } from "./contexts/AuthProvider";

import Dashboard from "./app/components/Dashboard";
import Transactions from "./app/components/Transactions";
import "./assets/css/main.css";

const queryClient = new QueryClient(); // Used for tanstack query
const drawerWidth = 240;
const minimizedDrawerWidth = 60;

function Layout() {
  const [open, setOpen] = useState(false);

  const handleToggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <Topbar onDrawerToggle={handleToggleDrawer} />
      <Sidebar open={open} />
      <Box
        component="main"
        sx={{
          transition: "margin 0.2s",
          marginLeft: open ? `${drawerWidth}px` : `${minimizedDrawerWidth}px`,
          padding: 2,
          marginTop: "64px",
          minHeight: "calc(100vh - 64px - 48px)",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/", element: <Dashboard /> },
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
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
