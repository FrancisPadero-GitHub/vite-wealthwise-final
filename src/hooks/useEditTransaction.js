import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthProvider";

export function useEditTransaction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { id, amount, type, ...updates } = transaction;
      const newAmount = parseFloat(amount);
      if (isNaN(newAmount) || newAmount < 0) throw new Error("Invalid amount");

      const newType = type.toLowerCase();

      // Get current balance
      const { data: balanceData, error: balanceError } = await supabase
        .from("BalanceTbl")
        .select("amount")
        .eq("user_id", user.id)
        .single();

      if (balanceError) throw new Error(balanceError.message);
      let currentBalance = parseFloat(balanceData.amount);

      // Get the old transaction (to reverse its effect)
      const { data: oldTx, error: oldTxError } = await supabase
        .from("TransactionTbl")
        .select("amount, type")
        .eq("id", id)
        .single();

      if (oldTxError) throw new Error("Failed to fetch old transaction.");

      const oldAmount = parseFloat(oldTx.amount);
      const oldType = oldTx.type.toLowerCase();

      // Reverse old transaction
      if (oldType === "income") {
        currentBalance -= oldAmount;
      } else if (oldType === "expense") {
        currentBalance += oldAmount;
      }

      // Apply new transaction
      if (newType === "income") {
        currentBalance += newAmount;
      } else if (newType === "expense") {
        currentBalance -= newAmount;
      } else {
        throw new Error("Invalid transaction type");
      }

      // Update the transaction
      const { data: updatedTx, error: updateTxError } = await supabase
        .from("TransactionTbl")
        .update({ ...updates, amount: newAmount, type: newType })
        .eq("id", id)
        .single();

      if (updateTxError) throw new Error(updateTxError.message);

      // Update the balance
      const { error: updateBalanceError } = await supabase
        .from("BalanceTbl")
        .update({ amount: currentBalance })
        .eq("user_id", user.id);

      if (updateBalanceError) throw new Error(updateBalanceError.message);

      return { updatedTx, newBalance: currentBalance };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries(["balance"]);
    },
  });
}
