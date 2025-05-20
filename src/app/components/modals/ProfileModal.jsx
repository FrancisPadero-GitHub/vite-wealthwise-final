import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Alert,
  Snackbar,
  Divider,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useProfile } from "../../../hooks/useProfile";
import { useAddTransaction } from "../../../hooks/useAddTransaction";
import { useDeleteTransaction } from "../../../hooks/useDeleteTransaction";
import { useUpdateBalance } from "../../../hooks/useUpdateBalance";
import { useReminders } from "../../../hooks/useReminders";
import { useChangePassword } from "../../../hooks/useChangePassword";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const generateDummyReminders = () => {
  const titles = [
    "Pay Rent",
    "Utility Bill Due",
    "Car Insurance Payment",
    "Credit Card Payment",
    "Phone Bill",
    "Internet Bill",
    "Grocery Shopping",
    "Doctor's Appointment",
    "Dentist Checkup",
    "Insurance Renewal",
  ];

  const descriptions = [
    "Don't forget to pay on time",
    "Important payment due",
    "Set reminder for payment",
    "Schedule this in advance",
    "Regular monthly payment",
  ];

  const reminders = [];
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30)); // Random date within next 30 days

    reminders.push({
      title: titles[Math.floor(Math.random() * titles.length)],
      description:
        descriptions[Math.floor(Math.random() * descriptions.length)],
      date: date.toISOString().split("T")[0],
    });
  }

  return reminders;
};

const generateDummyTransactions = () => {
  const categories = [
    "Food and Drinks",
    "Shopping",
    "House Rent",
    "Transportation",
    "Health & Medical",
    "Education",
    "Utilities",
    "Personal Care",
    "Entertainment",
    "Dining Out",
  ];
  const types = ["expense", "income"];
  const accounts = ["Cash", "Credit", "Gcash"];
  const descriptions = [
    "Monthly payment",
    "Regular expense",
    "One-time purchase",
    "Recurring payment",
    "Emergency expense",
  ];

  const transactions = [];
  for (let i = 0; i < 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = Math.abs(Math.floor(Math.random() * 4900) + 100); // Random amount between 100 and 5000

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    transactions.push({
      title: `${type === "income" ? "Income" : "Expense"} ${i + 1}`,
      amount,
      category: categories[Math.floor(Math.random() * categories.length)],
      type,
      account: accounts[Math.floor(Math.random() * accounts.length)],
      date: date.toISOString().split("T")[0],
      description:
        descriptions[Math.floor(Math.random() * descriptions.length)],
    });
  }

  return transactions;
};

export default function SettingsModal({ open, onClose }) {
  const { data: profile, isLoading, error } = useProfile();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const addTransaction = useAddTransaction();
  const { deleteAllTransactions } = useDeleteTransaction();
  const updateBalance = useUpdateBalance();
  const { addTask, deleteAllReminders } = useReminders();
  const { changePassword, isChanging } = useChangePassword();

  const handleGenerateDummyData = async () => {
    setIsGenerating(true);
    const dummyTransactions = generateDummyTransactions();
    const dummyReminders = generateDummyReminders();

    try {
      // Create separate loading states for transactions and reminders
      const transactionPromises = dummyTransactions.map(async (transaction) => {
        try {
          await addTransaction.mutateAsync(transaction);
        } catch (error) {
          console.error("Transaction error:", error);
          throw error;
        }
      });

      const reminderPromises = dummyReminders.map(async (reminder) => {
        try {
          await addTask(reminder);
        } catch (error) {
          console.error("Reminder error:", error);
          throw error;
        }
      });

      // Wait for all operations to complete
      await Promise.all([...transactionPromises, ...reminderPromises]);

      setSnackbar({
        open: true,
        message:
          "Successfully generated 20 dummy transactions and 20 reminders!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error generating dummy data: " + error.message,
        severity: "error",
      });
    } finally {
      // Only set isGenerating to false after all operations are complete
      setIsGenerating(false);
    }
  };

  const handleDeleteAllTransactions = async () => {
    try {
      // Run all delete operations in parallel
      await Promise.all([
        deleteAllTransactions.mutateAsync(),
        updateBalance.mutateAsync(0),
        deleteAllReminders(),
      ]);

      setSnackbar({
        open: true,
        message:
          "Successfully deleted all transactions, reminders, and reset balance!",
        severity: "success",
      });
      setShowDeleteConfirm(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting data: " + error.message,
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnackbar({
        open: true,
        message: "New passwords do not match",
        severity: "error",
      });
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setSnackbar({
        open: true,
        message: "Password updated successfully",
        severity: "success",
      });

      // Clear form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle variant="h6" cor>
          {" "}
          👤 Profile Settings
        </DialogTitle>
        <DialogContent dividers>
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">Error loading profile data</Typography>
          ) : (
            <Stack spacing={3}>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 3,
                  backgroundColor: "background.paper",
                  boxShadow: 1,
                }}
              >
                <Typography variant="h6" color="primary" gutterBottom>
                  📃 User Information
                </Typography>

                <Stack spacing={1}>
                  <Typography variant="body1">
                    📛 {profile?.full_name}
                  </Typography>
                  <Typography variant="body1">📧 {profile?.email}</Typography>
                </Stack>
              </Box>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    🔒 Security
                  </Typography>
                  <form onSubmit={handlePasswordChange}>
                    <Stack spacing={2}>
                      <TextField
                        label="Current Password"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        required
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  handleTogglePasswordVisibility("current")
                                }
                                edge="end"
                              >
                                {showPasswords.current ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        label="New Password"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        required
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  handleTogglePasswordVisibility("new")
                                }
                                edge="end"
                              >
                                {showPasswords.new ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        label="Confirm New Password"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  handleTogglePasswordVisibility("confirm")
                                }
                                edge="end"
                              >
                                {showPasswords.confirm ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isChanging}
                      >
                        {isChanging ? (
                          <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Changing Password...
                          </>
                        ) : (
                          "Change Password"
                        )}
                      </Button>
                    </Stack>
                  </form>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ backgroundColor: "#f9f9f9" }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    🔧 Developer Tools
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleGenerateDummyData}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Generating...
                        </>
                      ) : (
                        "Generate 20 Dummy Transactions and 20 Reminders"
                      )}
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={deleteAllTransactions.isPending}
                    >
                      {deleteAllTransactions.isPending ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Deleting...
                        </>
                      ) : (
                        "Reset Transactions and Reminders"
                      )}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All your transaction & reminder
            history will be permanently deleted.
          </Alert>
          <Typography>
            Are you sure you want to delete all transactions?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAllTransactions}
            color="error"
            variant="contained"
            disabled={deleteAllTransactions.isPending}
          >
            {deleteAllTransactions.isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Deleting...
              </>
            ) : (
              "Delete All"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={7000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
