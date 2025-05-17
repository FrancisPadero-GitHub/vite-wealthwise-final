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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
} from "@mui/icons-material";
import { useReminders } from "../../../hooks/useReminders";

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

    if (task) {
      const formattedDate = task.due_date
        ? new Date(task.due_date).toISOString().split("T")[0]
        : "";

      setForm({
        title: task.title || "",
        description: task.description || "",
        date: formattedDate,
      });
    } else {
      setForm({
        title: "",
        description: "",
        date: "",
      });
    }

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
    <Grid size={5}>
      <Card elevation={2}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Reminders
            </Typography>

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
              <Box>
                <Box px={2} py={1} display="flex" justifyContent="center">
                  <Typography variant="overline" color="text.secondary">
                    ⏳ Pending Tasks
                  </Typography>
                </Box>
                <List
                  sx={{
                    maxHeight: 650,
                    overflowY: "auto",
                    overflowX: "hidden",
                    pr: 1, // Prevent vertical scrollbar from overlapping content
                  }}
                >
                  {tasks.map((task) => (
                    <ListItem
                      key={task.id}
                      alignItems="center"
                      disableGutters
                      sx={{ padding: 0 }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: 2,
                          transition:
                            "transform 0.2s ease-in-out, background-color 0.2s",
                          "&:hover": {
                            transform: "scale(1.01)",
                            backgroundColor: "action.hover",
                          },
                          overflowX: "hidden",
                        }}
                      >
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <Box
                              display="flex"
                              flexDirection="column"
                              gap={0.5}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {task.description}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Due: {new Date(task.due_date).toDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                        <Stack direction="row" alignItems="center">
                          <IconButton
                            aria-label="mark as complete"
                            onClick={() => toggleStatus(task.id, true)}
                          >
                            <CheckCircleOutline color="success" />
                          </IconButton>
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleOpen(task)}
                            sx={{ ml: 1 }}
                          >
                            <EditOutlined color="primary" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
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
              </Box>
            )}

            {tasks.length > 0 && completedTasks.length > 0 && <Divider />}

            {completedTasks.length > 0 && (
              <Box>
                <Box px={2} py={1} display="flex" justifyContent="center">
                  <Typography variant="overline" color="text.secondary">
                    ✔️ Completed Tasks
                  </Typography>
                </Box>
                <List
                  sx={{
                    maxHeight: 650,
                    overflowY: "auto",
                    overflowX: "hidden",
                    pr: 1,
                  }}
                >
                  {completedTasks.map((task) => (
                    <ListItem
                      key={task.id}
                      alignItems="center"
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
                          transition:
                            "transform 0.2s ease-in-out, background-color 0.2s",
                          "&:hover": {
                            transform: "scale(1.01)",
                            backgroundColor: "action.hover",
                          },
                          overflowX: "hidden",
                        }}
                      >
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <Box
                              display="flex"
                              flexDirection="column"
                              gap={0.5}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {task.description}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Due: {new Date(task.due_date).toDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                        <Stack direction="row" alignItems="center">
                          <IconButton
                            aria-label="mark as incomplete"
                            onClick={() => toggleStatus(task.id, false)}
                          >
                            <Replay color="secondary" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
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
              </Box>
            )}

            {!tasks.length && !completedTasks.length && (
              <Box py={3} textAlign="center">
                <Typography color="text.secondary">
                  Click + to add a note
                </Typography>
              </Box>
            )}
          </Paper>

          <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>
              {editingTask ? "Edit Reminder" : "New Reminder"}
            </DialogTitle>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent full page reload
                handleSubmit();
              }}
            >
              <DialogContent>
                <TextField
                  margin="dense"
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  margin="dense"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  margin="dense"
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  required
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null
                  }
                >
                  {editingTask ? "Save Changes" : "Add"}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </CardContent>
      </Card>
    </Grid>
  );
}
