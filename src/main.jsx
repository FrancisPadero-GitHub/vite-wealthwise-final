import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Signin from "./app/auth/SignInSide.jsx";
import Signup from "./app/auth/SignUp.jsx";
import Dashboard from "./app/components/dashboard/Dashboard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Dashboard />
  </StrictMode>
);
