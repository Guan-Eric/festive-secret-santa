// app/(tabs)/(group)/person-wishlist.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../firebase';
import { WishlistItem } from '../../../types/index';

export default function PersonWishlistScreen() {
  const { groupId, personId, personName, accent } = useLocalSearchParams();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!personId || !groupId) return;

    const q = query(
      collection(db, 'wishlistItems'),
      where('userId', '==', personId),
      where('groupId', '==', groupId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as WishlistItem[];
      
      setWishlistItems(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [personId, groupId]);

  const handleBuyOnAmazon = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert('Cannot open Amazon link');
      }
    } catch (error) {
      console.error('Error opening link:', error);
      alert('Error opening Amazon');
    }
  };

  const getAccentColor = () => {
    const colors = {
      emerald: '#059669',
      red: '#EF4444',
      amber: '#F59E0B'
    };
    return colors[accent as keyof typeof colors] || colors.emerald;
  };

  const getBgColor = () => {
    const colors = {
      emerald: '#ECFDF5',
      red: '#FEF2F2',
      amber: '#FFFBEB'
    };
    return colors[accent as keyof typeof colors] || colors.emerald;
  };

  const getBorderColor = () => {
    const colors = {
      emerald: '#D1FAE5',
      red: '#FECACA',
      amber: '#FEF3C7'
    };
    return colors[accent as keyof typeof colors] || colors.emerald;
  };

  return (
    <View className="flex-1 bg-stone-50">
      <SafeAreaView edges={['top']} style={{ backgroundColor: getAccentColor() }}>
        <View className="px-4 pb-4">
          <View className="flex-row items-center mb-2">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-3xl font-bold text-white">
                {personName}'s Wishlist
              </Text>
              <Text className="text-white/80 text-sm">
                Find the perfect gift 🎁
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={getAccentColor()} />
          <Text className="text-stone-600 mt-4">Loading wishlist...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 pt-6">
          {wishlistItems.length === 0 ? (
            <View className="items-center py-20">
              <Text className="text-8xl mb-6">🎁</Text>
              <Text className="text-2xl font-semibold text-stone-900 mb-2 text-center">
                No items yet!
              </Text>
              <Text className="text-stone-600 text-center px-6">
                {personName} hasn't added any items to their wishlist yet. Check back soon!
              </Text>
            </View>
          ) : (
            <>
              {wishlistItems.map(item => (
                <View 
                  key={item.id} 
                  className="bg-white rounded-3xl p-6 mb-4 border-2"
                  style={{ borderColor: getBorderColor() }}
                >
                  <View className="flex-row items-start mb-5">
                    <Text className="text-6xl mr-4">{item.emoji || '🎁'}</Text>
                    <View className="flex-1">
                      <Text className="text-2xl font-bold text-stone-900 mb-2">
                        {item.productName}
                      </Text>
                      {item.price && (
                        <Text 
                          className="text-3xl font-bold mb-2" 
                          style={{ color: getAccentColor() }}
                        >
                          {item.price}
                        </Text>
                      )}
                      {item.notes && (
                        <View 
                          className="rounded-xl p-3 mt-2"
                          style={{ backgroundColor: getBgColor() }}
                        >
                          <Text className="text-stone-700 text-sm">
                            💭 {item.notes}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => handleBuyOnAmazon(item.productUrl)}
                    className="py-5 rounded-xl items-center active:scale-95"
                    style={{ backgroundColor: getAccentColor() }}
                    activeOpacity={0.8}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="cart" size={24} color="#fff" />
                      <Text className="text-white font-bold text-lg ml-3">
                        Buy on Amazon
                      </Text>
                      <Ionicons name="open-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
                    </View>
                  </TouchableOpacity>
                  
                  <Text className="text-stone-500 text-xs text-center mt-3">
                    Opens Amazon • Supports our app 🎅
                  </Text>
                </View>
              ))}
            </>
          )}

          <View className="bg-amber-50 rounded-2xl p-5 mb-4 border-2 border-amber-200">
            <View className="flex-row items-start">
              <Text className="text-2xl mr-3">🤫</Text>
              <Text className="flex-1 text-amber-900 text-sm">
                Remember to keep your gift a secret! The magic of Secret Santa is in the surprise. 🎅
              </Text>
            </View>
          </View>

          <View className="h-20" />
        </ScrollView>
      )}
    </View>
  );
}