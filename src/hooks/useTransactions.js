import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthProvider";

// Fetches all transactions and calculate totals
export function useTransactions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transactions", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("TransactionTbl")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useTransactionTotals() {
  const { data: transactions, isLoading, isError } = useTransactions();

  const calculateTotals = () => {
    if (!transactions) return { income: 0, expense: 0 };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate last month's date
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastMonthYear = lastMonthDate.getFullYear();

    // Calculate current month totals
    const currentMonthTotals = transactions.reduce(
      (acc, transaction) => {
        const transactionDate = new Date(transaction.date);
        if (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        ) {
          if (transaction.type === "income") {
            acc.income += transaction.amount;
          } else if (transaction.type === "expense") {
            acc.expense += transaction.amount;
          }
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    // Calculate last month totals
    const lastMonthTotals = transactions.reduce(
      (acc, transaction) => {
        const transactionDate = new Date(transaction.date);
        if (
          transactionDate.getMonth() === lastMonth &&
          transactionDate.getFullYear() === lastMonthYear
        ) {
          if (transaction.type === "income") {
            acc.income += transaction.amount;
          } else if (transaction.type === "expense") {
            acc.expense += transaction.amount;
          }
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    // Calculate percentage changes
    const incomeChange =
      lastMonthTotals.income === 0
        ? currentMonthTotals.income > 0
          ? 100
          : 0
        : ((currentMonthTotals.income - lastMonthTotals.income) /
            lastMonthTotals.income) *
          100;

    const expenseChange =
      lastMonthTotals.expense === 0
        ? currentMonthTotals.expense > 0
          ? 100
          : 0
        : ((currentMonthTotals.expense - lastMonthTotals.expense) /
            lastMonthTotals.expense) *
          100;

    return {
      current: currentMonthTotals,
      lastMonth: lastMonthTotals,
      changes: {
        income: incomeChange,
        expense: expenseChange,
      },
    };
  };

  const totals = calculateTotals();

  return {
    data: totals,
    isLoading,
    isError,
  };
}
