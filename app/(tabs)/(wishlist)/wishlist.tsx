// app/(tabs)/(wishlist)/wishlist.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../../firebase';
import { subscribeToUserGroups } from '../../../services/groupService';
import { deleteWishlistItem, subscribeToWishlistItems } from '../../../services/wishlistService';
import { Group, WishlistItem } from '../../../types/index';

export default function WishlistScreen() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const userId = auth.currentUser?.uid;

  // Load user's groups
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToUserGroups(userId, (groupsData) => {
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

    const unsubscribe = subscribeToWishlistItems(userId, selectedGroup, (items) => {
      setWishlistItems(items);
    });

    return unsubscribe;
  }, [userId, selectedGroup]);

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    Alert.alert(
      'Remove Item',
      `Remove "${itemName}" from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setDeleting(itemId);
            try {
              await deleteWishlistItem(itemId);
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to remove item');
            } finally {
              setDeleting(null);
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
      <View className="flex-1 bg-stone-50 items-center justify-center">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-stone-50">
      <SafeAreaView edges={['top']} className="bg-emerald-600">
        <View className="px-4 pb-4">
          <Text className="text-3xl font-bold text-white mb-1">
            My Wishlist
          </Text>
          <Text className="text-white/80 text-base">
            Manage your holiday wishes 🎁
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Group Selector */}
        <View className="bg-emerald-50 rounded-2xl p-5 mb-6 border-2 border-emerald-200">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-emerald-600 rounded-xl items-center justify-center">
              <Ionicons name="list" size={20} color="#fff" />
            </View>
            <Text className="text-sm font-bold text-emerald-900 uppercase tracking-wider ml-3">
              Select Group
            </Text>
          </View>
          <View className="bg-white border-2 border-emerald-300 rounded-xl overflow-hidden">
            <Picker
              selectedValue={selectedGroup}
              onValueChange={setSelectedGroup}
              style={{ color: '#1C1917' }}
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
        </View>

        {!selectedGroup ? (
          <View className="items-center py-20">
            <Text className="text-8xl mb-6">🎁</Text>
            <Text className="text-2xl font-semibold text-stone-900 mb-2">
              Select a group!
            </Text>
            <Text className="text-stone-600 text-center px-8">
              Choose a group to view and manage your wishlist
            </Text>
          </View>
        ) : wishlistItems.length === 0 ? (
          <View className="items-center py-20">
            <Text className="text-8xl mb-6">🎄</Text>
            <Text className="text-2xl font-semibold text-stone-900 mb-2">
              No items yet!
            </Text>
            <Text className="text-stone-600 text-center mb-6 px-8">
              Add items to your wishlist so your Secret Santa knows what to get you
            </Text>
            <TouchableOpacity
              onPress={handleAddItems}
              className="bg-emerald-600 px-8 py-4 rounded-xl active:scale-95"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text className="text-white font-bold text-lg ml-2">
                  Add Items
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {wishlistItems.map(item => (
              <View key={item.id} className="bg-white border-2 border-stone-200 rounded-2xl p-5 mb-4">
                <View className="flex-row items-start mb-4">
                  <Text className="text-6xl mr-4">{item.emoji || '🎁'}</Text>
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-stone-900 mb-1">
                      {item.productName}
                    </Text>
                    {item.price && (
                      <Text className="text-2xl font-bold text-emerald-700 mb-2">
                        {item.price}
                      </Text>
                    )}
                    {item.notes && (
                      <View className="bg-stone-50 rounded-xl p-3 mt-2">
                        <Text className="text-stone-600 text-sm">
                          💭 {item.notes}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <TouchableOpacity 
                  onPress={() => handleDeleteItem(item.id, item.productName)}
                  disabled={deleting === item.id}
                  className="bg-red-50 py-3 rounded-xl items-center border-2 border-red-200 active:scale-95"
                  activeOpacity={0.7}
                >
                  {deleting === item.id ? (
                    <ActivityIndicator color="#991B1B" />
                  ) : (
                    <View className="flex-row items-center">
                      <Ionicons name="trash-outline" size={20} color="#991B1B" />
                      <Text className="text-red-900 font-bold ml-2">Remove</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              onPress={handleAddItems}
              className="bg-white border-2 border-dashed border-emerald-300 rounded-2xl py-6 items-center active:scale-95 mb-4"
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={32} color="#059669" />
              <Text className="text-emerald-700 font-bold text-base mt-2">Add More Items</Text>
            </TouchableOpacity>

            {groups.find(g => g.id === selectedGroup) && (
              <View className="bg-amber-50 rounded-2xl p-5 mb-4 border-2 border-amber-200">
                <View className="flex-row items-start">
                  <Text className="text-2xl mr-3">🎅</Text>
                  <Text className="flex-1 text-amber-900 text-sm">
                    Your Secret Santa in "{groups.find(g => g.id === selectedGroup)?.name}" can see these items! ✨
                  </Text>
                </View>
              </View>
            )}
          </>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}