// import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
// import { useState } from 'react';
// import { Picker } from '@react-native-picker/picker';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { LinearGradient } from 'expo-linear-gradient';
// import Snowflake from '../../components/Snowflake';

// export default function SearchScreen() {
//   const [selectedGroup, setSelectedGroup] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');

//   const mockGroups = [
//     { id: 1, name: "Office Secret Santa 2025", emoji: "🎄" },
//     { id: 2, name: "Family Gift Exchange", emoji: "⛄" },
//     { id: 3, name: "Friends Holiday Party", emoji: "🎁" }
//   ];

//   const mockProducts = [
//     { id: 1, name: 'Festive Gift 1', price: 29.99, originalPrice: 39.99 },
//     { id: 2, name: 'Festive Gift 2', price: 39.99, originalPrice: 49.99 },
//     { id: 3, name: 'Festive Gift 3', price: 49.99, originalPrice: 59.99 },
//   ];

//   return (
//     <View className="flex-1 bg-red-950">
//       <ScrollView className="flex-1 px-4 pt-4">
//         <View className="mb-6">
//           <Text className="text-4xl font-bold text-white mb-2">
//             🔔 Search Gifts
//           </Text>
//           <Text className="text-white/60 text-sm">
//             🎁 Find the perfect holiday presents
//           </Text>
//         </View>

//         {/* Group Selector */}
//         <LinearGradient
//           colors={['rgba(220, 38, 38, 0.3)', 'rgba(22, 163, 74, 0.3)']}
//           className="rounded-3xl p-5 mb-6 border-2 border-white/20"
//         >
//           <View className="flex-row items-center mb-4">
//             <View className="w-10 h-10 bg-white/25 rounded-xl items-center justify-center border-2 border-white/40">
//               <Text className="text-xl">🎄</Text>
//             </View>
//             <Text className="text-sm font-bold text-white uppercase tracking-wider ml-3">
//               Add to Wishlist For
//             </Text>
//           </View>
//           <View className="bg-white/20 border-2 border-white/40 rounded-2xl overflow-hidden">
//             <Picker
//               selectedValue={selectedGroup}
//               onValueChange={setSelectedGroup}
//               style={{ color: '#fff' }}
//               dropdownIconColor="#fff"
//             >
//               <Picker.Item label="🎅 Select a group..." value="" />
//               {mockWishlist.map(item => (
//           <View key={item.id} className="bg-white/15 border-2 border-white/30 rounded-3xl p-6 mb-4">
//             <View className="flex-row items-center mb-5">
//               <Text className="text-7xl mr-5">{item.emoji}</Text>
//               <View className="flex-1">
//                 <Text className="text-2xl font-bold text-white">{item.name}</Text>
//                 <Text className="text-3xl font-bold text-green-300 mt-2">{item.price}</Text>
//               </View>
//             </View>
//             <TouchableOpacity
//               onPress={() => handleBuyOnAmazon(item.amazonUrl)}
//               className="bg-gradient-to-r from-red-600 to-green-600 py-5 rounded-xl items-center border-2 border-white/30 active:scale-95"
//               activeOpacity={0.8}
//             >
//               <View className="flex-row items-center">
//                 <Ionicons name="cart" size={24} color="#fff" />
//                 <Text className="text-white font-bold text-lg ml-3">
//                   🎁 Buy on Amazon
//                 </Text>
//                 <Ionicons name="open-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
//               </View>
//             </TouchableOpacity>
//             <Text className="text-white/50 text-xs text-center mt-4 font-semibold">
//               🎅 Opens Amazon with affiliate link • Supports our festive app • Ho ho ho!
//             </Text>
//           </View>
//         ))}

//         <View className="h-20" />
//       </ScrollView>
//     </View>
//   );
// }