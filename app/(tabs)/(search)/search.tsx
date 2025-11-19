// app/(tabs)/(search)/search.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../firebase';
import { searchAmazonProducts } from '../../../services/amazonAPI';
import { AmazonProduct } from '../../../types/index';

export default function SearchScreen() {
  const { groupId } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Enter Search Term', 'Please enter something to search for!');
      return;
    }

    setLoading(true);
    try {
      const results = await searchAmazonProducts(searchQuery);
      setProducts(results);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (product: AmazonProduct) => {
    if (!groupId) {
      Alert.alert('Error', 'No group selected');
      return;
    }

    setAdding(product.id);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('Not authenticated');

      await addDoc(collection(db, 'wishlistItems'), {
        userId,
        groupId,
        productName: product.title,
        productUrl: product.affiliateUrl,
        productImage: product.image,
        price: product.price,
        asin: product.asin,
        emoji: '🎁',
        createdAt: serverTimestamp(),
      });

      Alert.alert('Added!', `${product.title} has been added to your wishlist! 🎁`, [
        { text: 'Add More', style: 'cancel' },
        { text: 'View Wishlist', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      Alert.alert('Error', 'Failed to add item to wishlist');
    } finally {
      setAdding(null);
    }
  };

  return (
    <View className="flex-1 bg-red-950">
      <LinearGradient
        colors={['#7f1d1d', '#065f46']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pt-12 pb-4"
      >
        <SafeAreaView>
          <View className="flex-row items-center mb-4">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-12 h-12 bg-white/15 rounded-2xl items-center justify-center border-2 border-white/30 mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View className="flex-1">
            <Text className="text-3xl font-bold text-white">
                🔔 Search Gifts
              </Text>
              <Text className="text-white/70 text-sm">
                Find the perfect presents
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-white/15 border-2 border-white/30 rounded-2xl px-5 py-4">
            <Ionicons name="search" size={24} color="rgba(255,255,255,0.7)" />
            <TextInput
              placeholder="Search for gifts..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              className="flex-1 text-white text-lg ml-3"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={24} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSearch}
            disabled={loading}
            className="bg-white py-4 rounded-2xl items-center mt-4 active:scale-95"
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#7f1d1d" />
            ) : (
              <Text className="text-stone-900 font-bold text-lg">
                🎁 Search Amazon
              </Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-6">
        {products.length === 0 && !loading ? (
          <View className="items-center py-20">
            <Text className="text-8xl mb-6">🎁</Text>
            <Text className="text-2xl font-semibold text-white/90 mb-2">
              Search for gifts! 🎄
            </Text>
            <Text className="text-white/70 text-center">
              Enter a search term above to find perfect gifts on Amazon
            </Text>
          </View>
        ) : (
          products.map(product => (
            <View key={product.id} className="bg-white/15 border-2 border-white/30 rounded-3xl p-6 mb-4">
              <View className="mb-4">
                <Text className="text-xl font-bold text-white mb-2" numberOfLines={2}>
                  {product.title}
                </Text>
                {product.price && product.price !== 'N/A' && (
                  <Text className="text-3xl font-bold text-green-300">
                    {product.price}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => handleAddToWishlist(product)}
                disabled={adding === product.id}
                className="py-4 rounded-xl items-center border-2 border-white/30 active:scale-95"
                style={{ backgroundColor: '#059669' }}
                activeOpacity={0.8}
              >
                {adding === product.id ? (
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
          ))
        )}

        {products.length > 0 && (
          <LinearGradient
            colors={['rgba(234, 179, 8, 0.3)', 'rgba(249, 115, 22, 0.3)']}
            className="rounded-2xl p-4 mb-6 border-2 border-yellow-500/30"
          >
            <View className="flex-row items-start">
              <Text className="text-2xl mr-3">💡</Text>
              <Text className="flex-1 text-white text-sm">
                These products are from Amazon. When your Secret Santa buys through our affiliate links, it helps keep our app free! 🎅
              </Text>
            </View>
          </LinearGradient>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}