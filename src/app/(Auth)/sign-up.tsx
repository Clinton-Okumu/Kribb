import { useEffect, useState } from "react";
import {
  Alert,
  View,
  ScrollView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSignUp, useAuth } from "@clerk/expo";
import { useRouter, Link, Redirect } from "expo-router";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");

  const errorMessage = [
    errors.fields.firstName?.message,
    errors.fields.lastName?.message,
    errors.fields.emailAddress?.message,
    errors.fields.password?.message,
    errors.fields.code?.message,
    ...(errors.global?.map((e) => e.message) ?? []),
  ]
    .filter(Boolean)
    .join("\n");

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Sign up failed", errorMessage);
    }
  }, [errorMessage]);

  if (isSignedIn) return <Redirect href="/(root)/(tabs)" />;

  const isLoading = fetchStatus === "fetching";

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      console.error("Sign up error:", error);
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: () => {
          router.replace("/(root)/(tabs)");
        },
      });
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      console.error("Send email code error:", sendError);
    }
  };

  const onVerifyPress = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });

    if (error) {
      console.error("Verify email code error:", error);
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: () => {
          router.replace("/(root)/(tabs)");
        },
      });
    }
  };

  const showVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address");

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../../assets/images/kribb.png")}
          className="w-32 h-32"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Create account
        </Text>
        <Text className="text-gray-500 mb-8">Find your dream home today</Text>

        {!showVerification ? (
          <>
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <TextInput
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                  placeholder="First name"
                  placeholderTextColor="#9CA3AF"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>
              <View className="flex-1">
                <TextInput
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                  placeholder="Last name"
                  placeholderTextColor="#9CA3AF"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <TextInput
              className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View className="relative w-full mb-4">
              <TextInput
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-16"
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-0 bottom-0 px-4 justify-center"
              >
                <Text className="text-blue-600 font-semibold text-sm">
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={onSignUpPress}
              disabled={isLoading}
              className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Sign up</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center">
              <Text className="text-gray-500">Already have an account?</Text>
              <Link href="/(Auth)/sign-in">
                <Text className="text-blue-600 font-bold"> Sign in</Text>
              </Link>
            </View>
          </>
        ) : (
          <>
            <Text className="text-lg text-gray-700 mb-4">
              Enter the verification code sent to {signUp.emailAddress}
            </Text>
            <TextInput
              className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
              placeholder="Verification code"
              placeholderTextColor="#9CA3AF"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
            />

            <TouchableOpacity
              onPress={onVerifyPress}
              disabled={isLoading}
              className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Verify</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => signUp.verifications.sendEmailCode()}
              className="py-2"
            >
              <Text className="text-blue-600">Resend code</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => signUp.reset()} className="py-2">
              <Text className="text-blue-600">Start over</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}
