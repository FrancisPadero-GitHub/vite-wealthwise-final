import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  List,
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

  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", date: "" });

  const handleOpen = (task = null) => {
    setEditingTask(task);
    setForm(
      task || {
        title: "",
        description: "",
        date: "",
      }
    );
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (editingTask) {
      await updateTask({ ...form, id: editingTask.id });
    } else {
      await addTask(form);
    }
    handleClose();
  };

  return (
    <Grid size={6}>
      <Card elevation={3}>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Typography variant="h6" fontWeight="bold">
                Reminders
              </Typography>
            </div>
            <IconButton color="success" onClick={() => handleOpen()}>
              <AddIcon />
            </IconButton>
          </div>

          <List>
            {tasks.length ? (
              tasks.map((task) => (
                <ListItem
                  key={task.id}
                  alignItems="flex-start"
                  secondaryAction={
                    <>
                      <IconButton onClick={() => toggleStatus(task.id, true)}>
                        <CheckCircleOutline color="success" />
                      </IconButton>
                      <IconButton onClick={() => handleOpen(task)}>
                        <EditOutlined color="primary" />
                      </IconButton>
                      <IconButton onClick={() => deleteTask(task.id)}>
                        <DeleteOutline color="error" />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={task.title}
                    secondary={
                      <>
                        {task.description}
                        <br />
                        <small>
                          {new Date(task.created_at).toDateString()}
                        </small>
                      </>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Typography align="center" color="text.secondary">
                Click + to add a note
              </Typography>
            )}
            {completedTasks.length > 0 && (
              <>
                <Divider textAlign="center">✔️ Completed Tasks</Divider>
                {completedTasks.map((task) => (
                  <ListItem
                    key={task.id}
                    style={{ textDecoration: "line-through", color: "#999" }}
                    secondaryAction={
                      <>
                        <IconButton
                          onClick={() => toggleStatus(task.id, false)}
                        >
                          <Replay color="secondary" />
                        </IconButton>
                        <IconButton onClick={() => deleteTask(task.id)}>
                          <DeleteOutline color="error" />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <>
                          {task.description}
                          <br />
                          <small>
                            {new Date(task.created_at).toDateString()}
                          </small>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </>
            )}
          </List>

          <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>
              {editingTask ? "Edit Reminder" : "New Reminder"}
            </DialogTitle>
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
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="success"
              >
                {editingTask ? "Save Changes" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Grid>
  );
}
