import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function WishlistScreen() {
  const [selectedGroup, setSelectedGroup] = useState('');

  const mockGroups = [
    { id: 1, name: "Office Secret Santa 2025", emoji: "🎄" },
    { id: 2, name: "Family Gift Exchange", emoji: "⛄" },
  ];

  const mockWishlist = [
    { id: 1, name: "Wireless Mouse", price: "$29.99", emoji: "🖱️" },
    { id: 2, name: "Desk Plant", price: "$15.99", emoji: "🪴" }
  ];

  return (
    <View className="flex-1 bg-red-950">
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="mb-6">
          <Text className="text-4xl font-bold text-white mb-2">
            ⭐ My Wishlist
          </Text>
          <Text className="text-white/60 text-sm">
            🎁 Manage your holiday wishes
          </Text>
        </View>

        {/* Group Selector */}
        <LinearGradient
          colors={['rgba(22, 163, 74, 0.3)', 'rgba(16, 185, 129, 0.3)']}
          className="rounded-3xl p-5 mb-6 border-2 border-white/20"
        >
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-white/25 rounded-xl items-center justify-center border-2 border-white/40">
              <Text className="text-xl">🎄</Text>
            </View>
            <Text className="text-sm font-bold text-white uppercase tracking-wider ml-3">
              Showing Wishlist For
            </Text>
          </View>
          <View className="bg-white/20 border-2 border-white/40 rounded-2xl overflow-hidden">
            <Picker
              selectedValue={selectedGroup}
              onValueChange={setSelectedGroup}
              style={{ color: '#fff' }}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="🎅 Select a group..." value="" />
              {mockGroups.map(group => (
                <Picker.Item 
                  key={group.id} 
                  label={`${group.emoji} ${group.name}`} 
                  value={group.id} 
                />
              ))}
            </Picker>
          </View>
        </LinearGradient>

        {!selectedGroup ? (
          <View className="items-center py-20">
            <Text className="text-8xl mb-6">🎁</Text>
            <Text className="text-2xl font-semibold text-white/90 mb-2">
              Select a group! 🎄
            </Text>
            <Text className="text-white/70">
              Choose a group to view your wishlist
            </Text>
          </View>
        ) : (
          <>
            {mockWishlist.map(item => (
              <View key={item.id} className="bg-white/15 border-2 border-white/30 rounded-3xl p-5 mb-4 flex-row items-center">
                <Text className="text-6xl mr-5">{item.emoji}</Text>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-white">{item.name}</Text>
                  <Text className="text-2xl font-bold text-green-300 mt-1">{item.price}</Text>
                </View>
                <TouchableOpacity className="w-14 h-14 bg-red-500/30 rounded-xl items-center justify-center border-2 border-red-400/50">
                  <Ionicons name="heart" size={28} color="#F87171" />
                </TouchableOpacity>
              </View>
            ))}

            <LinearGradient
              colors={['rgba(234, 179, 8, 0.3)', 'rgba(249, 115, 22, 0.3)']}
              className="rounded-3xl p-5 border-2 border-yellow-500/40"
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🎅</Text>
                <Text className="flex-1 text-white text-sm font-semibold">
                  Your Secret Santa in "{mockGroups[0].name}" can see these magical items! ✨
                </Text>
              </View>
            </LinearGradient>
          </>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}