import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Footer from "./app/structure/Footer";
import Sidebar from "./app/structure/Sidebar";
import Topbar from "./app/structure/Topbar";

import SignIn from "./app/auth/SignIn";
import SignUp from "./app/auth/SignUp";

import ProtectedRoute from "./app/components/ProtectedRoutes";
import { AuthProvider } from "./contexts/AuthProvider";
import RealtimeBalanceListener from "./api/realTimeBalanceListener";

import Dashboard from "./app/components/Dashboard";
import Profile from "./app/components/Profile";
import Transactions from "./app/components/Transactions";

import { Box, CssBaseline } from "@mui/material";

// 🧠 Create React Query client instance
const queryClient = new QueryClient();

const drawerWidth = 240;

function Layout() {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <CssBaseline />
      <Topbar onDrawerToggle={toggleDrawer} />
      <Sidebar open={open} />
      <RealtimeBalanceListener />
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

// 🛣️ Define routes
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
