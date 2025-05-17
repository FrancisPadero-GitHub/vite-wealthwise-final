import { supabase } from "../supabase"; // adjust path if needed

export async function fetchBalance(userId) {
  // First try to fetch existing balance
  const { data, error } = await supabase
    .from("BalanceTbl")
    .select("amount")
    .eq("user_id", userId)
    .single();

  // If no record exists (error.code === 'PGRST116'), insert a default one
  if (error?.code === "PGRST116") {
    const { data: newData, error: insertError } = await supabase
      .from("BalanceTbl")
      .insert([{ user_id: userId, amount: 0, cash_balance: "cash" }])
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return newData;
  }

  // If there was an error other than "no rows returned", throw it
  if (error) {
    throw new Error(error.message);
  }

  return data;
}
