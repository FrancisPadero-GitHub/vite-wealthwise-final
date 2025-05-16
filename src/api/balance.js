import { supabase } from "../supabase"; // adjust path if needed

export async function fetchBalance(userId) {
  const { data, error } = await supabase
    .from("BalanceTbl")
    .select("amount")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
