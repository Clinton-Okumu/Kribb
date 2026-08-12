import FeaturedCard from "@/components/FeaturedCard";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(true);

  const fetchProperties = useCallback(async () => {
    setFeaturedLoading(true);
    setRecommendedLoading(true);

    try {
      const [{ data: featuredData, error: featuredError }, { data: recommendedData, error: recommendedError }] =
        await Promise.all([
          supabase
            .from("properties")
            .select("*")
            .eq("is_featured", true)
            .order("created_at", { ascending: false }),
          supabase
            .from("properties")
            .select("*")
            .eq("is_featured", false)
            .order("created_at", { ascending: false }),
        ]);

      if (featuredError) throw featuredError;
      if (recommendedError) throw recommendedError;

      setFeatured(featuredData ?? []);
      setRecommended(recommendedData ?? []);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      Alert.alert("Error", "Failed to load properties. Please try again.");
    } finally {
      setFeaturedLoading(false);
      setRecommendedLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, [fetchProperties]),
  );

  const isLoading = featuredLoading || recommendedLoading;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={fetchProperties}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
              <Image
                source={require("@/assets/images/kribb.png")}
                style={{ width: 90, height: 36 }}
                resizeMode="contain"
              />
              <View className="items-end">
                <Text className="text-gray-500 text-xs">Good morning 👋</Text>
                <Text className="text-gray-900 text-base font-bold">
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>

            {/* Search Bar */}
            <View className="mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 gap-3"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Pressable
                onPress={() => router.push("/(root)/(tabs)/search")}
                className="flex-1 flex-row items-center"
              >
                <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                <Text className="text-gray-400 text-sm ml-3 flex-1">
                  Search properties, cities...
                </Text>
              </Pressable>

              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(tabs)/search?openFilters=true")
                }
                className="w-8 h-8 bg-blue-600 rounded-xl items-center justify-center"
              >
                <Ionicons name="options-outline" size={15} color="white" />
              </TouchableOpacity>
            </View>

            {/* Featured Section */}
            <View className="mb-6">
              <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
                Featured
              </Text>

              {featuredLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                  className="py-10"
                />
              ) : featured.length === 0 ? (
                <View className="px-5 py-8">
                  <Text className="text-gray-400 text-center">
                    No featured properties
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={featured}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <FeaturedCard property={item} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                />
              )}
            </View>

            {/* Recommended Header */}
            <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
              Recommended
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <PropertyCard property={item} />
          </View>
        )}
        ListEmptyComponent={
          !recommendedLoading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400">No properties found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
