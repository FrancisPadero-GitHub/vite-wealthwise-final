import { useQuery } from "@tanstack/react-query";
import { fetchBalance } from "../api/balance";
import { useAuth } from "../contexts/AuthProvider";

export function useBalance() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["balance"],
    queryFn: () =>
      user?.id ? fetchBalance(user.id) : Promise.reject("User ID is undefined"),
    enabled: !!user?.id, // only runs if user is logged in
  });
}
