import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function GroupsScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Mock data
    setGroups([
      {
        id: '1',
        name: "Office Secret Santa 2025",
        members: 8,
        assignedToName: "Sarah Smith",
        assignedTo: "user2",
        emoji: '',
        memberIds: [],
        colors: [],
        createdBy: '',
        createdAt: undefined,
        accent: ''
      },
      {
        id: '2',
        name: "Family Gift Exchange",
        members: 12,
        assignedToName: "Mike Johnson",
        assignedTo: "user3",
        emoji: '',
        memberIds: [],
        colors: [],
        createdBy: '',
        createdAt: undefined,
        accent: ''
      },
      {
        id: '3',
        name: "Friends Holiday Party",
        members: 6,
        assignedToName: "Emma Wilson",
        assignedTo: "user4",
        emoji: '',
        memberIds: [],
        colors: [],
        createdBy: '',
        createdAt: undefined,
        accent: ''
      }
    ]);
  }, []);

  const getAccentColor = (accent: string) => {
    const colors = {
      emerald: '#059669',
      red: '#EF4444',
      amber: '#F59E0B'
    };
    return colors[accent] || colors.emerald;
  };

  const handleViewWishlist = (group: Group) => {
    router.push({
      pathname: '/person-wishlist',
      params: { 
        groupId: group.id, 
        personId: group.assignedTo,
        personName: group.assignedToName,
        accent: group.accent
      }
    });
  };

  return (
    <View className="flex-1 bg-stone-50">
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-stone-900 mb-2">
            My Groups
          </Text>
          <Text className="text-base text-stone-600">
            Your gift exchanges
          </Text>
        </View>

        {groups.map(group => (
          <View key={group.id} className="bg-white rounded-2xl mb-4 overflow-hidden border-2 border-stone-200">
            <View className="p-6">
              <View className="mb-4">
                <Text className="text-xl font-bold text-stone-900 mb-2">
                  {group.name}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="people" size={16} color="#78716C" />
                  <Text className="text-stone-600 ml-2">
                    {group.members} participants
                  </Text>
                </View>
              </View>

              <View className="bg-stone-50 rounded-xl p-5 border-2" style={{ borderColor: group.accent === 'emerald' ? '#D1FAE5' : group.accent === 'red' ? '#FECACA' : '#FED7AA' }}>
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: getAccentColor(group.accent) }}>
                    <Ionicons name="gift" size={16} color="#fff" />
                  </View>
                  <Text className="text-xs text-stone-600 uppercase ml-2 tracking-widest">
                    Your Secret Assignment
                  </Text>
                </View>
                <Text className="text-2xl font-bold text-stone-900 mb-4">
                  {group.assignedTo}
                </Text>
                <TouchableOpacity
                  onPress={() => handleViewWishlist(group)}
                  className="py-3 rounded-lg items-center active:scale-95"
                  style={{ backgroundColor: getAccentColor(group.accent) }}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="gift" size={16} color="#fff" />
                    <Text className="text-white font-bold ml-2">
                      View Wishlist
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View className="h-20" />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute right-6 bottom-6 w-14 h-14 rounded-full items-center justify-center active:scale-110"
        style={{ backgroundColor: '#059669' }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
