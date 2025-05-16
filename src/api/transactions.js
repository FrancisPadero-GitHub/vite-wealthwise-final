import { supabase } from "../supabase"; // adjust path if needed

export async function fetchTransactions(userId) {
  const { data, error } = await supabase
    .from("TransactionTbl")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
