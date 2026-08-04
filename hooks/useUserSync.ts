import { useUser } from "@clerk/expo";
import { useUserStore } from "../store/userStore";
import { useSupabase } from "../lib/useSupabase";
import { useEffect } from "react";

export function useUserSync() {
  const { user } = useUser();
  const setIdAdmin = useUserStore((state) => state.setIsAdmin);
  const authSupabase = useSupabase();

  useEffect(() => {
    if (!user) return;
    syncUser();
  }, [user]);

  const syncUser = async () => {
    const { data } = await authSupabase
      .from("users")
      .select("clerk_id, is_admin")
      .eq("clerk_id", user!.id)
      .single();
    if (data) {
      setIdAdmin(data.is_admin ?? false);
      return;
    }
  };
}
