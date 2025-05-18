import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthProvider";

export function useDeleteTransaction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const deleteTransaction = useMutation({
    mutationFn: async (transactionId) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("TransactionTbl")
        .delete()
        .eq("id", transactionId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries(["balance"]); // ✅ Re-fetch balance after adding
    },
  });

  const deleteAllTransactions = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      // Get all transactions first
      const { data: transactions, error: fetchError } = await supabase
        .from("TransactionTbl")
        .select("id");

      if (fetchError) throw new Error(fetchError.message);

      // Delete each transaction
      for (const transaction of transactions) {
        const { error } = await supabase
          .from("TransactionTbl")
          .delete()
          .eq("id", transaction.id);

        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries(["balance"]);
    },
  });

  return {
    deleteTransaction,
    deleteAllTransactions,
  };
}
