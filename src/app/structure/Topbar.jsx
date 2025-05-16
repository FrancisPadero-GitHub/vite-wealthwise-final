import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

export default function Topbar({ onDrawerToggle }) {
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" component="div" noWrap sx={{ mr: 15 }}>
            WealthWise
          </Typography>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Box>

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
