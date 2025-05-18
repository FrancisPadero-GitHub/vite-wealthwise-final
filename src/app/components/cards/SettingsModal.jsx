import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useProfile } from "../../../hooks/useProfile";

export default function SettingsModal({ open, onClose }) {
  const { data: profile, isLoading, error } = useProfile();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Profile Settings</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Error loading profile data</Typography>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Full Name:</strong> {profile?.full_name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Email:</strong> {profile?.email}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Username:</strong> {profile?.username}
            </Typography>
            {/* Add more profile fields as needed */}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
