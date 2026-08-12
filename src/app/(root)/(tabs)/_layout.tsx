import { Tabs } from "expo-router/js-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../../../store/userStore";

export default function TabsLayout() {
  const isAdmin = useUserStore((state) => state.isAdmin);
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />

      {isAdmin && (
        <Tabs.Screen
          name="create"
          options={{
            title: "Add Property",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" color={color} size={size} />
            ),
          }}
        />
      )}

      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
