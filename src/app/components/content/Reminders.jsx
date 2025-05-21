import { useState, useEffect } from "react";
import {
  Grid,
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
  Divider,
  Snackbar,
  Alert,
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
import dayjs from "dayjs";
import reminders from "../../../assets/img/icon.png";
import RemindersRealtime from "../../../api/RemindersRealtime";
import ReminderModal from "../modals/ReminderModal";

export default function RemindersCard() {
  const {
    tasks,
    completedTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleStatus,
    isLoading,
    error,
  } = useReminders();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", date: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setSnackbar({
        open: true,
        message: "Task deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete task",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // For the loading animation
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error: {error.message}</Alert>;
  }

  return (
    <>
      <RemindersRealtime />
      <Card elevation={2}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Box display="flex" alignItems="center">
              <img
                src={reminders}
                alt="Reminders"
                style={{ width: "30px", height: "30px", marginRight: "10px" }}
              />
              <Typography variant="h6" fontWeight="bold">
                Reminders
              </Typography>
            </Box>
            <IconButton color="success" onClick={() => handleOpen()}>
              <AddIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2} rowGap={1}>
            {/* Pending Tasks Paper */}
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <Paper
                elevation={1}
                sx={{
                  height: "100%",
                  maxHeight: 650,
                  borderRadius: 2,
                  boxShadow: 2,
                  px: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {tasks.length > 0 && (
                  <Box display="flex" flexDirection="column" height="100%">
                    {/* Header */}
                    <Box px={2} py={1} display="flex" justifyContent="center">
                      <Typography variant="overline" color="text.secondary">
                        ⏳ Pending Tasks
                      </Typography>
                    </Box>

                    {/* Scrollable Task List */}
                    <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                      <List disablePadding>
                        {tasks.map((task) => (
                          <ListItem key={task.id} disableGutters>
                            <Box
                              sx={{
                                width: "100%",
                                display: "flex",
                                alignItems: "flex-start", // aligns text top left
                                justifyContent: "space-between",
                                padding: 2,
                                gap: 2,
                                transition:
                                  "transform 0.2s, background-color 0.2s",
                                "&:hover": {
                                  transform: "scale(1.01)",
                                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                                },
                              }}
                            >
                              {/* Task Text */}
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" fontWeight="bold">
                                  {task.title}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  {task.description}
                                </Typography>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ mt: 1, display: "block" }} // space before due date
                                >
                                  Due:{" "}
                                  {dayjs(task.due_date).format("MMM D, YYYY")}
                                </Typography>
                              </Box>

                              {/* Action Buttons */}
                              <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{ ml: "auto", alignSelf: "flex-start" }}
                              >
                                <IconButton
                                  onClick={() => toggleStatus(task.id, true)}
                                >
                                  <CheckCircleOutline color="success" />
                                </IconButton>
                                <IconButton onClick={() => handleOpen(task)}>
                                  <EditOutlined color="primary" />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <DeleteOutline color="error" />
                                </IconButton>
                              </Stack>
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>
            {/* End of Pending Tasks Paper */}

            {tasks.length > 0 && completedTasks.length > 0 && <Divider />}

            {/* Completed Tasks Paper */}
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <Paper
                elevation={1}
                sx={{
                  height: "100%",
                  maxHeight: 400,
                  borderRadius: 2,
                  boxShadow: 2,
                  px: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {completedTasks.length > 0 && (
                  <Box display="flex" flexDirection="column" height="100%">
                    {/* Header */}
                    <Box px={2} py={1} display="flex" justifyContent="center">
                      <Typography variant="overline" color="text.secondary">
                        ✅ Completed Tasks
                      </Typography>
                    </Box>

                    {/* Scrollable List Area */}
                    <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                      <List disablePadding>
                        {completedTasks.map((task) => (
                          <ListItem
                            key={task.id}
                            disableGutters
                            sx={{
                              padding: 0,
                              color: "#999",
                              textDecoration: "line-through",
                            }}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                padding: 2,
                                gap: 2,
                                transition:
                                  "transform 0.2s, background-color 0.2s",
                                "&:hover": {
                                  transform: "scale(1.01)",
                                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                                },
                              }}
                            >
                              {/* Task Text */}
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="body1"
                                  fontWeight="bold"
                                >
                                  {task.title}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  {task.description}
                                </Typography>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ mt: 2, display: "block" }}
                                >
                                  Due:{" "}
                                  {dayjs(task.due_date).format("MMM D, YYYY")}
                                </Typography>
                              </Box>

                              {/* Action Buttons */}
                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{ ml: "auto", alignSelf: "flex-start" }}
                              >
                                <IconButton
                                  onClick={() => toggleStatus(task.id, false)}
                                >
                                  <Replay color="action" />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <DeleteOutline color="error" />
                                </IconButton>
                              </Stack>
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>
            {/* End of Completed Tasks Paper */}
          </Grid>
          {!tasks.length && !completedTasks.length && (
            <Card elevation={2}>
              <Box py={3} textAlign="center">
                <Typography color="text.secondary">
                  Click + to add a note
                </Typography>
              </Box>
            </Card>
          )}
        </CardContent>
      </Card>

      <ReminderModal
        open={open}
        handleClose={handleClose}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
        editingTask={editingTask}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
