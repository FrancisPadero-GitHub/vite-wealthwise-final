import React, { useState, useCallback } from "react";
import {
  Chip,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTransactions } from "../../../hooks/useTransactions";
import { useAddTransaction } from "../../../hooks/useAddTransaction";
import { useEditTransaction } from "../../../hooks/useEditTransaction";
import { useDeleteTransaction } from "../../../hooks/useDeleteTransaction";
import TransactionFormModal from "../TransactionFormModal";

const defaultFormValues = {
  title: "",
  amount: "",
  category: "",
  type: "",
  account: "",
  date: "",
  description: "",
};

export default function TransactionTable() {
  const [loading, setLoading] = useState(false);

  const { data: transactions, isLoading, error } = useTransactions();
  const { mutateAsync: addTransaction } = useAddTransaction();
  const { mutateAsync: editTransaction } = useEditTransaction();
  const { mutate: deleteTransaction } = useDeleteTransaction();

  const [searchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultFormValues);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const openAddModal = useCallback(() => {
    setSelectedTransaction(null);
    setForm(defaultFormValues);
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((transaction) => {
    setSelectedTransaction(transaction);
    setForm(transaction);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedTransaction(null);
    setForm(defaultFormValues);
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        if (selectedTransaction) {
          await editTransaction(form);
        } else {
          await addTransaction(form);
        }
        handleCloseModal();
      } catch (error) {
        console.error("Transaction failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      selectedTransaction,
      form,
      addTransaction,
      editTransaction,
      handleCloseModal,
    ]
  );

  const handleDelete = useCallback(() => {
    if (selectedTransaction?.id) {
      deleteTransaction(selectedTransaction.id);
      handleCloseModal();
    }
  }, [selectedTransaction, deleteTransaction, handleCloseModal]);

  const filteredTransactions =
    transactions?.filter((tx) =>
      [
        tx.title,
        tx.category,
        tx.description,
        tx.account,
        tx.date,
        tx.type,
        tx.amount.toString(),
      ].some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <Grid size={7}>
      <Card elevation={2}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Recent Transactions</Typography>
            <IconButton color="success" onClick={openAddModal}>
              <AddIcon />
            </IconButton>
          </Box>
          <Paper
            sx={{
              maxHeight: 650,
              overflowY: "auto",
              borderRadius: 2,
              boxShadow: 2,
              p: 2,
            }}
          >
            <Box display="flex" flexDirection="column" gap={1}>
              {filteredTransactions.map((tx, index) => (
                <React.Fragment key={tx.id}>
                  <Box
                    onClick={() => openEditModal(tx)}
                    sx={{
                      p: 2,
                      backgroundColor: "background.paper",
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      "&:hover": {
                        transform: "scale(1.01)",
                        backgroundColor: "grey.100",
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box flexGrow={1}>
                        <Typography variant="h6" gutterBottom>
                          {tx.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          gutterBottom
                        >
                          {tx.category}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {tx.description}
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-end"
                        gap={1}
                      >
                        <Typography variant="subtitle1">
                          ₱ {tx.amount}
                        </Typography>
                        {tx.type === "income" ? (
                          <Chip label="Income" size="small" color="success" />
                        ) : (
                          <Chip label="Expense" size="small" color="error" />
                        )}
                        <Typography variant="caption" color="textSecondary">
                          {tx.account}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      align="right"
                    >
                      {tx.date}
                    </Typography>
                  </Box>
                  {index < filteredTransactions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          </Paper>
        </CardContent>
      </Card>

      <TransactionFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        form={form}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        loading={loading}
        selectedTransaction={selectedTransaction}
      />
    </Grid>
  );
}
