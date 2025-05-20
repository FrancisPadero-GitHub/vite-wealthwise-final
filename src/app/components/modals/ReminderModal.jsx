import {
  Box,
  Modal,
  Typography,
  IconButton,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, Save as SaveIcon } from "@mui/icons-material";

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
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        sx={modalStyle}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
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

        <Grid container>
          <Grid size={12}>
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
          <Grid size={12}>
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
          <Grid size={12}>
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
  );
}
