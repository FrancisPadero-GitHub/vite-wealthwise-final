import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  CircularProgress,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { supabase } from "../../supabase";
import { useProfile } from "../../hooks/useProfile";
import SettingsModal from "../components/cards/SettingsModal";
import wealthwise from "../../assets/img/wealthwise.png";

export default function Topbar({ onDrawerToggle }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { data: profile, isLoading } = useProfile();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#FAF9F6",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={wealthwise}
              alt="WealthWise"
              style={{
                width: "40px",
                height: "40px",
                marginRight: "10px",
                marginBottom: "10px",
              }}
            />
            <Typography
              variant="h1"
              component="div"
              noWrap
              sx={{ mr: 5, fontSize: "1.5rem", fontWeight: "bold" }}
              color="primary"
            >
              WealthWise
            </Typography>

            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={onDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "#000000",
              }}
              onClick={handleMenuClick}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1,
                  bgcolor: "#1976d2",
                }}
              >
                {profile?.full_name?.[0] || "U"}
              </Avatar>
              <Typography variant="subtitle1">
                {isLoading ? "Loading..." : profile?.full_name || "User"}
              </Typography>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  backgroundColor: "#ffffff",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  setIsSettingsOpen(true);
                }}
              >
                <SettingsOutlinedIcon sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleSignOut} disabled={isLoggingOut}>
                {isLoggingOut ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={18} />
                    Logging out...
                  </Box>
                ) : (
                  <>
                    <LogoutOutlinedIcon sx={{ mr: 1 }} />
                    Logout
                  </>
                )}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
