import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { CssBaseline, Box } from "@mui/material";

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

const queryClient = new QueryClient();
const drawerWidth = 240;

function Layout() {
  const [open, setOpen] = useState(true);

  const handleToggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <CssBaseline />
      <Topbar onDrawerToggle={handleToggleDrawer} />
      <Sidebar open={open} />
      <Box
        component="main"
        sx={{
          transition: "margin 0.2s",
          marginLeft: open ? `${drawerWidth}px` : 0,
          padding: 3,
          marginTop: "64px",
          minHeight: "calc(100vh - 64px - 48px)",
          backgroundColor: "#f5f5f7",
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
  ]);

  return (
    <>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
