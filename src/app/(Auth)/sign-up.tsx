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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
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
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 py-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center max-w-md w-full self-center my-auto">
            {/* Header section */}
            <View className="items-center mb-6">
              <View className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200/60 mb-5">
                <Image
                  source={require("../../../assets/images/kribb.png")}
                  className="w-36 h-12"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-2">
                Create account
              </Text>
              <Text className="text-slate-500 text-base text-center">
                Find your dream home today with Kribb
              </Text>
            </View>

            {/* Main Form Card or Verification Box */}
            <View className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm mb-6">
              {!showVerification ? (
                <>
                  {/* Name fields row */}
                  <View className="flex-row gap-3 mb-4">
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        First Name
                      </Text>
                      <View className="flex-row items-center border border-slate-200 rounded-2xl px-3.5 py-3 bg-slate-50/50">
                        <Ionicons name="person-outline" size={18} color="#64748B" />
                        <TextInput
                          className="flex-1 ml-2 text-slate-900 text-base"
                          placeholder="First name"
                          placeholderTextColor="#94A3B8"
                          value={firstName}
                          onChangeText={setFirstName}
                          autoCapitalize="words"
                        />
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Last Name
                      </Text>
                      <View className="flex-row items-center border border-slate-200 rounded-2xl px-3.5 py-3 bg-slate-50/50">
                        <Ionicons name="person-outline" size={18} color="#64748B" />
                        <TextInput
                          className="flex-1 ml-2 text-slate-900 text-base"
                          placeholder="Last name"
                          placeholderTextColor="#94A3B8"
                          value={lastName}
                          onChangeText={setLastName}
                          autoCapitalize="words"
                        />
                      </View>
                    </View>
                  </View>

                  {/* Email field */}
                  <View className="mb-4">
                    <Text className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address
                    </Text>
                    <View className="flex-row items-center border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50">
                      <Ionicons name="mail-outline" size={20} color="#64748B" />
                      <TextInput
                        className="flex-1 ml-3 text-slate-900 text-base"
                        placeholder="name@example.com"
                        placeholderTextColor="#94A3B8"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  {/* Password field */}
                  <View className="mb-6">
                    <Text className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Password
                    </Text>
                    <View className="flex-row items-center border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50">
                      <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
                      <TextInput
                        className="flex-1 ml-3 pr-2 text-slate-900 text-base"
                        placeholder="Create a password"
                        placeholderTextColor="#94A3B8"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword((prev) => !prev)}
                        className="p-1"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons
                          name={showPassword ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color="#64748B"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    onPress={onSignUpPress}
                    disabled={isLoading}
                    activeOpacity={0.8}
                    className="w-full bg-blue-600 active:bg-blue-700 py-4 rounded-2xl items-center justify-center flex-row gap-2 shadow-lg shadow-blue-500/25"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <>
                        <Text className="text-white font-bold text-base">Create Account</Text>
                        <Ionicons name="arrow-forward" size={18} color="white" />
                      </>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View className="items-center mb-6">
                    <View className="w-14 h-14 rounded-2xl bg-blue-100 items-center justify-center mb-3 border border-blue-200">
                      <Ionicons name="shield-checkmark" size={28} color="#2563EB" />
                    </View>
                    <Text className="text-xl font-bold text-slate-900 text-center mb-1">
                      Verify Your Email
                    </Text>
                    <Text className="text-slate-500 text-sm text-center">
                      Code sent to <Text className="font-semibold text-slate-700">{signUp.emailAddress}</Text>
                    </Text>
                  </View>

                  <View className="mb-5">
                    <Text className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Verification Code
                    </Text>
                    <View className="flex-row items-center border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50">
                      <Ionicons name="key-outline" size={20} color="#64748B" />
                      <TextInput
                        className="flex-1 ml-3 text-slate-900 text-base font-semibold tracking-widest"
                        placeholder="Enter code"
                        placeholderTextColor="#94A3B8"
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={onVerifyPress}
                    disabled={isLoading}
                    activeOpacity={0.8}
                    className="w-full bg-blue-600 active:bg-blue-700 py-4 rounded-2xl items-center justify-center flex-row gap-2 shadow-lg shadow-blue-500/25 mb-4"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <>
                        <Text className="text-white font-bold text-base">Verify & Continue</Text>
                        <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                      </>
                    )}
                  </TouchableOpacity>

                  <View className="gap-2 items-center pt-2 border-t border-slate-100">
                    <TouchableOpacity
                      onPress={() => signUp.verifications.sendEmailCode()}
                      className="py-2 px-4 rounded-xl active:bg-slate-100"
                    >
                      <Text className="text-blue-600 font-semibold text-sm">Resend code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => signUp.reset()}
                      className="py-1 px-4 rounded-xl active:bg-slate-100"
                    >
                      <Text className="text-slate-500 text-sm font-medium">Start over</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>

            {/* Footer link */}
            {!showVerification && (
              <View className="flex-row justify-center items-center py-2">
                <Text className="text-slate-500 text-sm font-medium">Already have an account? </Text>
                <Link href="/(Auth)/sign-in">
                  <Text className="text-blue-600 font-bold text-sm">Sign In</Text>
                </Link>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
