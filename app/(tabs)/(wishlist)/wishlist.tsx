// app/(tabs)/(wishlist)/wishlist.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../firebase';
import { Group, WishlistItem } from '../../../types';

export default function WishlistScreen() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const userId = auth.currentUser?.uid;

  // Load user's groups
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'groups'),
      where('memberIds', 'array-contains', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groupsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Group[];
      
      setGroups(groupsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  // Load wishlist items for selected group
  useEffect(() => {
    if (!userId || !selectedGroup) {
      setWishlistItems([]);
      return;
    }

    const q = query(
      collection(db, 'wishlistItems'),
      where('userId', '==', userId),
      where('groupId', '==', selectedGroup)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as WishlistItem[];
      
      setWishlistItems(items);
    });

    return unsubscribe;
  }, [userId, selectedGroup]);

  const handleDeleteItem = async (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'wishlistItems', itemId));
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to remove item');
            }
          }
        }
      ]
    );
  };

  const handleAddItems = () => {
    if (!selectedGroup) {
      Alert.alert('Select a Group', 'Please select a group first to add items to your wishlist.');
      return;
    }
    router.push({
      pathname: '/(tabs)/(search)/search',
      params: { groupId: selectedGroup }
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-red-950 items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading...</Text>
      </View>
    );
  }

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
              {groups.map(group => (
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
            <Text className="text-white/70 text-center">
              Choose a group to view and manage your wishlist
            </Text>
          </View>
        ) : wishlistItems.length === 0 ? (
          <View className="items-center py-20">
            <Text className="text-8xl mb-6">🎁</Text>
            <Text className="text-2xl font-semibold text-white/90 mb-2">
              No items yet! 🎄
            </Text>
            <Text className="text-white/70 text-center mb-6">
              Add items to your wishlist so your Secret Santa knows what to get you
            </Text>
            <TouchableOpacity
              onPress={handleAddItems}
              className="bg-white px-8 py-4 rounded-xl active:scale-95"
              activeOpacity={0.8}
            >
              <Text className="text-stone-900 font-bold text-lg">
                Add Items to Wishlist
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {wishlistItems.map(item => (
              <View key={item.id} className="bg-white/15 border-2 border-white/30 rounded-3xl p-5 mb-4 flex-row items-center">
                <Text className="text-6xl mr-5">{item.emoji || '🎁'}</Text>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-white">{item.productName}</Text>
                  {item.price && (
                    <Text className="text-2xl font-bold text-green-300 mt-1">{item.price}</Text>
                  )}
                  {item.notes && (
                    <Text className="text-white/70 text-sm mt-1">{item.notes}</Text>
                  )}
                </View>
                <TouchableOpacity 
                  onPress={() => handleDeleteItem(item.id)}
                  className="w-14 h-14 bg-red-500/30 rounded-xl items-center justify-center border-2 border-red-400/50 ml-3"
                >
                  <Ionicons name="trash" size={24} color="#F87171" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              onPress={handleAddItems}
              className="bg-white/10 border-2 border-dashed border-white/30 rounded-2xl py-6 items-center active:scale-95 mb-4"
            >
              <Ionicons name="add-circle-outline" size={32} color="rgba(255,255,255,0.7)" />
              <Text className="text-white/70 font-bold mt-2">Add More Items</Text>
            </TouchableOpacity>

            {groups.find(g => g.id === selectedGroup) && (
              <LinearGradient
                colors={['rgba(234, 179, 8, 0.3)', 'rgba(249, 115, 22, 0.3)']}
                className="rounded-3xl p-5 border-2 border-yellow-500/40"
              >
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">🎅</Text>
                  <Text className="flex-1 text-white text-sm font-semibold">
                    Your Secret Santa in "{groups.find(g => g.id === selectedGroup)?.name}" can see these magical items! ✨
                  </Text>
                </View>
              </LinearGradient>
            )}
          </>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}