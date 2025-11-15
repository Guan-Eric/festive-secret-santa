import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 2,
          borderTopColor: '#E7E5E4',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: '#065F46',
        tabBarInactiveTintColor: '#78716C',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(group)"
        options={{
          title: 'My Groups',
          tabBarIcon: ({ color, focused }) => (
            <View >
              <Ionicons name="people" size={22} color={color} />
            </View>
          ),
          tabBarLabel: ({ focused }) => focused ? '' : 'Groups',
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          title: 'Search Gifts',
          tabBarIcon: ({ color, focused }) => (
            <View >
              <Ionicons name="search" size={22} color={color} />
            </View>
          ),
          tabBarLabel: ({ focused }) => focused ? '' : 'Search',
        }}
      />
      <Tabs.Screen
        name="(wishlist)"
        options={{
          title: 'My Wishlist',
          tabBarIcon: ({ color, focused }) => (
            <View >
              <Ionicons name="heart" size={22} color={color} />
            </View>
          ),
          tabBarLabel: ({ focused }) => focused ? '' : 'Wishlist',
        }}
      />
    </Tabs>
  );
}
