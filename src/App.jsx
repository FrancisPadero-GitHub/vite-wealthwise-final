import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

import { Box, CssBaseline } from "@mui/material";

// 🧠 Create React Query client instance
const queryClient = new QueryClient();

const drawerWidth = 240;

function Layout() {
  return (
    <>
      <CssBaseline />
      <Topbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          marginLeft: `${drawerWidth}px`,
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
