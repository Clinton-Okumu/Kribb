import { useAuth } from "@clerk/expo";
import { Redirect, Slot } from "expo-router";
import { useUserSync } from "../../../hooks/useUserSync";

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // sync clerk user data to supabase
  useUserSync();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(Auth)/sign-in" />;

  return <Slot />;
}
