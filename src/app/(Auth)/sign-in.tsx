import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function SignIn() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-gray-800 mb-2">Sign In</Text>
      <Text className="text-gray-500 mb-8">Welcome back</Text>

      <Link
        href="/(Auth)/sign-up"
        className="text-blue-500 text-base mt-4"
      >
        Don&apos;t have an account?{" "}
        <Text className="font-semibold underline">Sign up</Text>
      </Link>
    </View>
  );
}
