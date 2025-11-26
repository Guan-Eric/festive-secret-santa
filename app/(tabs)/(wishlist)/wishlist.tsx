// app/(tabs)/(wishlist)/wishlist.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
  const [dropdownVisible, setDropdownVisible] = useState(false)
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
          
          <TouchableOpacity
            onPress={() => setDropdownVisible(true)}
            className="bg-white border-2 border-emerald-300 rounded-xl px-5 py-4 flex-row items-center justify-between active:bg-stone-50"
            activeOpacity={0.7}
          >
            {selectedGroup ? (
              <View className="flex-row items-center flex-1">
                <Text className="text-2xl mr-3">
                  {groups.find(g => g.id === selectedGroup)?.emoji}
                </Text>
                <Text className="text-stone-900 text-base font-semibold flex-1">
                  {groups.find(g => g.id === selectedGroup)?.name}
                </Text>
              </View>
            ) : (
              <Text className="text-stone-500 text-base">Select a group...</Text>
            )}
            <Ionicons name="chevron-down" size={20} color="#78716C" />
          </TouchableOpacity>

          {!selectedGroup && (
            <Text className="text-emerald-700 text-xs mt-2 ml-1">
              Choose which group this item is for
            </Text>
          )}
        </View>
        {/* Group Selection Modal */}
        <Modal
          visible={dropdownVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableOpacity 
            className="flex-1 bg-black/50"
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          >
            <View className="flex-1 justify-end">
              <TouchableOpacity activeOpacity={1}>
                <View className="bg-white rounded-t-3xl">
                  <View className="px-6 py-5 border-b-2 border-stone-100 flex-row items-center justify-between">
                    <Text className="text-xl font-bold text-stone-900">Select Group</Text>
                    <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                      <Ionicons name="close" size={28} color="#57534E" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView className="max-h-96">
                    {groups.map(group => (
                      <TouchableOpacity
                        key={group.id}
                        onPress={() => {
                          setSelectedGroup(group.id);
                          setDropdownVisible(false);
                        }}
                        className="px-6 py-4 flex-row items-center border-b border-stone-100 active:bg-emerald-50"
                        activeOpacity={0.7}
                      >
                        <Text className="text-3xl mr-4">{group.emoji}</Text>
                        <Text className="text-stone-900 text-base font-semibold flex-1">
                          {group.name}
                        </Text>
                        {selectedGroup === group.id && (
                          <Ionicons name="checkmark-circle" size={24} color="#059669" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View className="h-8" />
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {!selectedGroup ? (
          <View className="items-center py-20">
            <Image
              source={require('../../../assets/images/secret-santa-logo.png')}
              style={{ width: 100, height: 100, marginBottom: 24 }}
              resizeMode="contain"
            />
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