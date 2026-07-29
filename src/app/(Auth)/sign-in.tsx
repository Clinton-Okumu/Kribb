import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");

  const errorMessage = [
    errors.fields.identifier?.message,
    errors.fields.password?.message,
    errors.fields.code?.message,
    ...(errors.global?.map((e) => e.message) ?? []),
  ]
    .filter(Boolean)
    .join("\n");

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Sign in failed", errorMessage);
    }
  }, [errorMessage]);

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });
    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: () => {
          router.replace("/(root)/(tabs)");
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const onVerifyPress = async () => {
    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: () => {
          router.replace("/(root)/(tabs)");
        },
      });
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const isLoading = fetchStatus === "fetching";

  if (signIn.status === "needs_client_trust") {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="px-6 py-8"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 justify-center max-w-md w-full self-center my-auto">
              <View className="items-center mb-8">
                <View className="w-16 h-16 rounded-2xl bg-blue-100 items-center justify-center mb-4 border border-blue-200">
                  <Ionicons name="shield-checkmark" size={32} color="#2563EB" />
                </View>
                <Image
                  source={require("../../../assets/images/kribb.png")}
                  className="w-36 h-12 mb-3"
                  resizeMode="contain"
                />
                <Text className="text-2xl font-extrabold text-slate-900 mb-1 text-center">
                  Verify your account
                </Text>
                <Text className="text-slate-500 text-center text-sm">
                  Please enter the verification code sent to your email
                </Text>
              </View>

              <View className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm mb-6">
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
                      keyboardType="number-pad"
                      value={code}
                      onChangeText={setCode}
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
                      <Text className="text-white font-bold text-base">Verify Account</Text>
                      <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                    </>
                  )}
                </TouchableOpacity>

                <View className="gap-2 items-center pt-2 border-t border-slate-100">
                  <TouchableOpacity
                    onPress={() => signIn.mfa.sendEmailCode()}
                    className="py-2 px-4 rounded-xl active:bg-slate-100"
                  >
                    <Text className="text-blue-600 font-semibold text-sm">I need a new code</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => signIn.reset()}
                    className="py-1 px-4 rounded-xl active:bg-slate-100"
                  >
                    <Text className="text-slate-500 text-sm font-medium">Start over</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
            <View className="items-center mb-8">
              <View className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200/60 mb-5">
                <Image
                  source={require("../../../assets/images/kribb.png")}
                  className="w-36 h-12"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-2">
                Welcome back
              </Text>
              <Text className="text-slate-500 text-base text-center">
                Sign in to your Kribb account to continue
              </Text>
            </View>

            {/* Form card */}
            <View className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm mb-6">
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
                    placeholder="Enter your password"
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

              {/* Sign In Button */}
              <TouchableOpacity
                onPress={onSignInPress}
                disabled={isLoading}
                activeOpacity={0.8}
                className="w-full bg-blue-600 active:bg-blue-700 py-4 rounded-2xl items-center justify-center flex-row gap-2 shadow-lg shadow-blue-500/25"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-base">Sign In</Text>
                    <Ionicons name="arrow-forward" size={18} color="white" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer link */}
            <View className="flex-row justify-center items-center py-2">
              <Text className="text-slate-500 text-sm font-medium">Don&apos;t have an account? </Text>
              <Link href="/sign-up">
                <Text className="text-blue-600 font-bold text-sm">Sign Up</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
