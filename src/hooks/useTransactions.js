import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../api/transactions"; // adjust path if needed
import { useAuth } from "../contexts/AuthProvider";

export function useTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["transactions"],
    queryFn: () =>
      user?.id
        ? fetchTransactions(user.id)
        : Promise.reject("User ID is undefined"),
    enabled: !!user?.id,
  });
}
