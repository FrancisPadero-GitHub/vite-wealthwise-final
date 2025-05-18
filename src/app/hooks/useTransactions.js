import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
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

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Calculate current month totals
    const currentMonthTotals = transactions.reduce(
      (acc, transaction) => {
        const transactionDate = new Date(transaction.created_at);
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
        const transactionDate = new Date(transaction.created_at);
        if (
          transactionDate.getMonth() === lastMonth &&
          transactionDate.getFullYear() === lastYear
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
        ? 100
        : ((currentMonthTotals.income - lastMonthTotals.income) /
            lastMonthTotals.income) *
          100;

    const expenseChange =
      lastMonthTotals.expense === 0
        ? 100
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
