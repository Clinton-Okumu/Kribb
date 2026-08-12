import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface PropertyCardProps {
  property: Property;
  onPress?: () => void;
}

export default function PropertyCard({ property, onPress }: PropertyCardProps) {
  const imageUrl = property.images?.[0];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white rounded-2xl overflow-hidden mb-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="h-[200px] bg-gray-200">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center bg-gray-300">
            <Ionicons name="image-outline" size={48} color="#9CA3AF" />
          </View>
        )}

        {property.is_sold && (
          <View className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">Sold</Text>
          </View>
        )}

        <View className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full">
          <Text className="text-blue-700 text-sm font-bold">
            {formatPrice(property.price)}
          </Text>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row items-start justify-between mb-1">
          <Text className="text-gray-900 text-lg font-bold flex-1 mr-2" numberOfLines={1}>
            {property.title}
          </Text>
          <View className="bg-gray-100 px-2 py-1 rounded-md">
            <Text className="text-gray-600 text-xs font-medium capitalize">
              {property.type}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-3">
          <Ionicons name="location-outline" size={14} color="#9CA3AF" />
          <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
            {property.city}
          </Text>
        </View>

        <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
          <View className="flex-row items-center">
            <Ionicons name="bed-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {property.bedrooms} Beds
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="water-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {property.bathrooms} Baths
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="resize-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {property.area_sqft} sqft
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
