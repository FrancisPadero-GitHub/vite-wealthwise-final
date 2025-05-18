import { useState } from "react";
import {
  Card,
  Paper,
  Stack,
  Box,
  List,
  CardContent,
  Typography,
  IconButton,
  ListItem,
  ListItemText,
  Grid,
  Modal,
  TextField,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  CheckCircleOutline,
  DeleteOutline,
  EditOutlined,
  Replay,
  Close as CloseIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useReminders } from "../../../hooks/useReminders";
import dayjs from "dayjs";
import reminders from "../../../assets/img/icon.png";

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

export default function RemindersCard() {
  const {
    tasks,
    completedTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleStatus,
  } = useReminders();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", date: "" });

  const handleOpen = (task = null) => {
    setEditingTask(task);
    setForm({
      title: task?.title || "",
      description: task?.description || "",
      date: task?.due_date
        ? new Date(task.due_date).toISOString().split("T")[0]
        : "",
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingTask) {
        await updateTask({ ...form, id: editingTask.id });
      } else {
        await addTask(form);
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card elevation={2}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box display="flex" alignItems="center">
              <img
                src={reminders}
                alt="Reminders"
                style={{ width: "40px", height: "40px", marginRight: "10px" }}
              />
              <Typography variant="h6" fontWeight="bold">
                Reminders
              </Typography>
            </Box>

            <IconButton color="success" onClick={() => handleOpen()}>
              <AddIcon />
            </IconButton>
          </Box>

          <Paper
            elevation={1}
            sx={{
              maxHeight: 650,
              overflowY: "auto",
              borderRadius: 2,
              boxShadow: 2,
              px: 2,
            }}
          >
            {tasks.length > 0 && (
              <>
                <Box px={2} py={1} display="flex" justifyContent="center">
                  <Typography variant="overline" color="text.secondary">
                    ⏳ Pending Tasks
                  </Typography>
                </Box>
                <List sx={{ maxHeight: 650, overflowY: "auto", pr: 1 }}>
                  {tasks.map((task) => (
                    <ListItem key={task.id} disableGutters sx={{ padding: 0 }}>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: 2,
                          transition: "transform 0.2s, background-color 0.2s",
                          "&:hover": {
                            transform: "scale(1.01)",
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                      >
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                              >
                                {task.description}
                              </Typography>
                              <br />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                component="span"
                              >
                                Due:{" "}
                                {dayjs(task.due_date).format("MMM D, YYYY")}
                              </Typography>
                            </>
                          }
                        />
                        <Stack direction="row" alignItems="center">
                          <IconButton
                            onClick={() => toggleStatus(task.id, true)}
                          >
                            <CheckCircleOutline color="success" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleOpen(task)}
                            sx={{ ml: 1 }}
                          >
                            <EditOutlined color="primary" />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteTask(task.id)}
                            sx={{ ml: 1 }}
                          >
                            <DeleteOutline color="error" />
                          </IconButton>
                        </Stack>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {tasks.length > 0 && completedTasks.length > 0 && <Divider />}

            {completedTasks.length > 0 && (
              <>
                <Box px={2} py={1} display="flex" justifyContent="center">
                  <Typography variant="overline" color="text.secondary">
                    ✅ Completed Tasks
                  </Typography>
                </Box>
                <List sx={{ maxHeight: 650, overflowY: "auto", pr: 1 }}>
                  {completedTasks.map((task) => (
                    <ListItem
                      key={task.id}
                      disableGutters
                      sx={{
                        padding: 0,
                        textDecoration: "line-through",
                        color: "#999",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: 2,
                          transition: "transform 0.2s, background-color 0.2s",
                          "&:hover": {
                            transform: "scale(1.01)",
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                              >
                                {task.description}
                              </Typography>
                              <br />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                component="span"
                              >
                                Due:{" "}
                                {dayjs(task.due_date).format("MMM D, YYYY")}
                              </Typography>
                            </>
                          }
                        />
                        <Stack direction="row" alignItems="center">
                          <IconButton
                            onClick={() => toggleStatus(task.id, false)}
                          >
                            <Replay color="action" />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteTask(task.id)}
                            sx={{ ml: 1 }}
                          >
                            <DeleteOutline color="error" />
                          </IconButton>
                        </Stack>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {!tasks.length && !completedTasks.length && (
              <Box py={3} textAlign="center">
                <Typography color="text.secondary">
                  Click + to add a note
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Dialog for Add/Edit */}
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
                  {editingTask ? "Edit Reminder" : "New Reminder"}
                </Typography>
                <IconButton aria-label="close" onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Grid container spacing={2} columns={12}>
                <Grid size={12}>
                  <TextField
                    id="reminder-title"
                    name="title"
                    label="Title"
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
                    label="Due Date"
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
                    label="Description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={4}
                    required
                    margin="normal"
                  />
                </Grid>
              </Grid>

              <Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  sx={{ mt: 2 }}
                  fullWidth
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
              </Grid>
            </Box>
          </Modal>
        </CardContent>
      </Card>
    </>
  );
}
