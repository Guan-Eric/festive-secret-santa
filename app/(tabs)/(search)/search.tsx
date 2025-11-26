// app/(tabs)/(search)/search.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../../firebase';
import { subscribeToUserGroups } from '../../../services/groupService';
import { addWishlistItem } from '../../../services/wishlistService';
import { Group } from '../../../types/index';

const AMAZON_ASSOCIATE_TAG = Constants.expoConfig?.extra?.amazonAssociateTag;

export default function SearchScreen() {
  const params = useLocalSearchParams();
  const [selectedGroup, setSelectedGroup] = useState(params.groupId as string || '');
  const [groups, setGroups] = useState<Group[]>([]);
  const [manualProductName, setManualProductName] = useState('');
  const [amazonUrl, setAmazonUrl] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const router = useRouter();
  const userId = auth.currentUser?.uid;

  // Load user's groups
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToUserGroups(userId, (groupsData) => {
      setGroups(groupsData);
      setLoading(false);
      
      // If groupId was passed in params, use it
      if (params.groupId) {
        setSelectedGroup(params.groupId as string);
      }
    });

    return unsubscribe;
  }, [userId]);

  const addAffiliateTag = (url: string): string => {
    if (!url.trim()) return '';
    
    try {
      const urlObj = new URL(url);
      
      // Check if it's an Amazon URL
      if (!urlObj.hostname.includes('amazon.com')) {
        return url;
      }

      // Add or update the tag parameter
      urlObj.searchParams.set('tag', AMAZON_ASSOCIATE_TAG);
      return urlObj.toString();
    } catch (error) {
      // If URL parsing fails, just append the tag
      return url.includes('?') 
        ? `${url}&tag=${AMAZON_ASSOCIATE_TAG}`
        : `${url}?tag=${AMAZON_ASSOCIATE_TAG}`;
    }
  };

  const handleAddManualItem = async () => {
    if (!selectedGroup) {
      Alert.alert('Select a Group', 'Please select a group first');
      return;
    }

    if (!manualProductName.trim()) {
      Alert.alert('Missing Product Name', 'Please enter a product name');
      return;
    }

    if (!amazonUrl.trim()) {
      Alert.alert('Missing Amazon URL', 'Please enter an Amazon product URL');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    setAdding(true);
    try {
      const affiliateUrl = addAffiliateTag(amazonUrl);

      await addWishlistItem({
        userId,
        groupId: selectedGroup,
        productName: manualProductName.trim(),
        productUrl: affiliateUrl,
        price: manualPrice.trim() || "",
        notes: manualNotes.trim() || "",
        emoji: '🎁',
      });

      Alert.alert(
        'Added! 🎁', 
        `${manualProductName} has been added to your wishlist!`,
        [
          { 
            text: 'Add Another', 
            style: 'cancel',
            onPress: () => {
              // Clear form but keep group selected
              setManualProductName('');
              setAmazonUrl('');
              setManualPrice('');
              setManualNotes('');
            }
          },
          { 
            text: 'View Wishlist', 
            onPress: () => router.push('/(tabs)/(wishlist)/wishlist')
          }
        ]
      );

      // Clear form
      setManualProductName('');
      setAmazonUrl('');
      setManualPrice('');
      setManualNotes('');
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item to wishlist');
    } finally {
      setAdding(false);
    }
  };

  const handleBrowseAmazon = () => {
    Alert.alert(
      '🎁 How to Add Items',
      '1. Open Amazon in your browser\n2. Find a product you want\n3. Copy the product URL\n4. Paste it here along with the product name',
      [{ text: 'Got it!' }]
    );
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
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-3xl font-bold text-white">
                Add to Wishlist
              </Text>
              <Text className="text-white/80 text-sm">
                Add items from Amazon 🎁
              </Text>
            </View>
          </View>
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
              Select a Group First
            </Text>
            <Text className="text-stone-600 text-center px-8">
              Choose a group above to start adding items to your wishlist
            </Text>
          </View>
        ) : (
          <>
            {/* Instructions Card */}
            <View className="bg-amber-50 rounded-2xl p-5 mb-6 border-2 border-amber-200">
              <View className="flex-row items-start mb-3">
                <Text className="text-3xl mr-3">💡</Text>
                <View className="flex-1">
                  <Text className="text-amber-900 font-bold text-lg mb-2">
                    How to Add Items
                  </Text>
                  <Text className="text-amber-800 text-sm leading-5">
                    1. Browse Amazon and find a product{'\n'}
                    2. Copy the product URL{'\n'}
                    3. Paste it below with the product name{'\n'}
                    4. Your Secret Santa will see it on your wishlist!
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleBrowseAmazon}
                className="bg-amber-600 py-3 rounded-xl items-center mt-2 active:scale-95"
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold">View Instructions</Text>
              </TouchableOpacity>
            </View>

            {/* Manual Entry Form */}
            <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-stone-200">
              <Text className="text-xl font-bold text-stone-900 mb-5">
                ✍️ Add Item Details
              </Text>

              {/* Product Name */}
              <View className="mb-4">
                <Text className="text-stone-700 font-semibold mb-2">
                  Product Name *
                </Text>
                <View className="bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3">
                  <TextInput
                    placeholder="e.g., Wireless Headphones"
                    placeholderTextColor="#A8A29E"
                    value={manualProductName}
                    onChangeText={setManualProductName}
                    className="text-stone-900 text-base"
                  />
                </View>
              </View>

              {/* Amazon URL */}
              <View className="mb-4">
                <Text className="text-stone-700 font-semibold mb-2">
                  Amazon Product URL *
                </Text>
                <View className="bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3">
                  <TextInput
                    placeholder="https://www.amazon.com/..."
                    placeholderTextColor="#A8A29E"
                    value={amazonUrl}
                    onChangeText={setAmazonUrl}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    className="text-stone-900 text-base"
                  />
                </View>
              </View>

              {/* Price (Optional) */}
              <View className="mb-4">
                <Text className="text-stone-700 font-semibold mb-2">
                  Price (Optional)
                </Text>
                <View className="bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3 flex-row items-center">
                  <Text className="text-stone-900 text-lg font-bold mr-2">$</Text>
                  <TextInput
                    placeholder="29.99"
                    placeholderTextColor="#A8A29E"
                    value={manualPrice}
                    onChangeText={setManualPrice}
                    keyboardType="decimal-pad"
                    className="flex-1 text-stone-900 text-base"
                  />
                </View>
              </View>

              {/* Notes (Optional) */}
              <View className="mb-5">
                <Text className="text-stone-700 font-semibold mb-2">
                  Notes (Optional)
                </Text>
                <View className="bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3">
                  <TextInput
                    placeholder="e.g., Prefer blue color, Size M"
                    placeholderTextColor="#A8A29E"
                    value={manualNotes}
                    onChangeText={setManualNotes}
                    multiline
                    numberOfLines={3}
                    className="text-stone-900 text-base"
                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                  />
                </View>
              </View>

              {/* Add Button */}
              <TouchableOpacity
                onPress={handleAddManualItem}
                disabled={adding}
                className="py-4 rounded-xl items-center active:scale-95"
                style={{ backgroundColor: '#059669' }}
                activeOpacity={0.8}
              >
                {adding ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View className="flex-row items-center">
                    <Ionicons name="add-circle" size={24} color="#fff" />
                    <Text className="text-white font-bold text-lg ml-3">
                      Add to Wishlist
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Affiliate Disclosure */}
            <View className="bg-emerald-50 rounded-2xl p-5 mb-6 border-2 border-emerald-200">
              <View className="flex-row items-start">
                <Text className="text-2xl mr-3">🎅</Text>
                <Text className="flex-1 text-emerald-800 text-sm">
                  When your Secret Santa buys through your Amazon links, we earn a small commission that helps keep the app free! Your affiliate tag is automatically added to all links.
                </Text>
              </View>
            </View>
          </>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}