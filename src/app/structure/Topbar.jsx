import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase"; // adjust path if needed

export default function Topbar() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      setIsLoggingOut(false);
    } else {
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          WealthWise Barebones
        </Typography>
        <Button
          color="inherit"
          onClick={handleSignOut}
          disabled={isLoggingOut}
          startIcon={
            isLoggingOut ? <CircularProgress color="inherit" size={18} /> : null
          }
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
