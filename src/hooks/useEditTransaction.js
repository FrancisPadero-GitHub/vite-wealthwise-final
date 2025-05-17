import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthProvider";

export function useEditTransaction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { id, ...updates } = transaction;

      const { data, error } = await supabase
        .from("TransactionTbl")
        .update(updates)
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries(["balance"]); // ✅ Re-fetch balance after adding
    },
  });
}
