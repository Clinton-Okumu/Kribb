import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface FeaturedCardProps {
  property: Property;
  onPress?: () => void;
}

export default function FeaturedCard({ property, onPress }: FeaturedCardProps) {
  const imageUrl = property.images?.[0];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mr-4 w-[280px] h-[200px] rounded-3xl overflow-hidden bg-gray-200"
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <View className="absolute inset-0 items-center justify-center bg-gray-300">
          <Ionicons name="image-outline" size={40} color="#9CA3AF" />
        </View>
      )}

      <View className="absolute inset-0 bg-black/30" />

      <View className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full">
        <Text className="text-blue-700 text-sm font-bold">
          {formatPrice(property.price)}
        </Text>
      </View>

      <View className="absolute bottom-0 left-0 right-0 p-4">
        <View className="flex-row items-center mb-1">
          <View className="bg-blue-600 px-2 py-0.5 rounded-md mr-2">
            <Text className="text-white text-xs font-medium capitalize">
              {property.type}
            </Text>
          </View>
          {property.is_sold && (
            <View className="bg-red-500 px-2 py-0.5 rounded-md">
              <Text className="text-white text-xs font-medium">Sold</Text>
            </View>
          )}
        </View>

        <Text className="text-white text-lg font-bold" numberOfLines={1}>
          {property.title}
        </Text>

        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={14} color="white" />
          <Text className="text-white/90 text-sm ml-1" numberOfLines={1}>
            {property.city}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
