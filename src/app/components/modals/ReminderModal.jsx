import {
  Box,
  Modal,
  Typography,
  IconButton,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Close as CloseIcon, Save as SaveIcon } from "@mui/icons-material";
import { useState } from "react";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

export default function ReminderModal({
  open,
  handleClose,
  form,
  handleChange,
  handleSubmit,
  loading,
  editingTask,
}) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit();
      setSnackbar({
        open: true,
        message: editingTask
          ? "Reminder updated successfully"
          : "Reminder added successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Operation failed",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box component="form" sx={modalStyle} onSubmit={handleFormSubmit}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">
              {editingTask ? "✏️ Edit Reminder" : "🔔 New Reminder"}
            </Typography>
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid container columnSpacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
              <TextField
                id="reminder-title"
                name="title"
                label="📝 Title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
              <TextField
                id="reminder-date"
                name="date"
                type="date"
                label="📅 Due Date"
                InputLabelProps={{ shrink: true }}
                value={form.date}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <TextField
                id="reminder-description"
                name="description"
                label="📋 Description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={4}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
            >
              {editingTask ? "Save Changes" : "Add"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
