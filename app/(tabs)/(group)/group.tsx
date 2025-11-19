// app/(tabs)/(group)/group.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../firebase';
import { Assignment, Group } from '../../../types/index';

export default function GroupsScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const userId = auth.currentUser?.uid;

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
    });

    return unsubscribe;
  }, [userId]);

  const getAccentColor = (accent?: string) => {
    const colors = {
      emerald: '#059669',
      red: '#EF4444',
      amber: '#F59E0B'
    };
    return colors[accent as keyof typeof colors] || colors.emerald;
  };

  const getMyAssignment = (group: Group): Assignment | null => {
    if (!group.matched || !group.assignments) return null;
    return group.assignments.find(a => a.giverId === userId) || null;
  };

  const handleViewWishlist = (group: Group, assignment: Assignment) => {
    router.push({
      pathname: '/(tabs)/(group)/person-wishlist',
      params: { 
        groupId: group.id, 
        personId: assignment.receiverId,
        personName: assignment.receiverName,
        accent: group.accent || 'emerald'
      }
    });
  };

  const handleCreateGroup = () => {
    router.push('/(tabs)/(group)/createGroup');
  };

  const handleGroupDetails = (group: Group) => {
    router.push({
      pathname: '/(tabs)/(group)/groupDetail',
      params: { groupId: group.id }
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

        {groups.length === 0 ? (
          <View className="items-center py-20">
            <Text className="text-8xl mb-6">🎁</Text>
            <Text className="text-2xl font-semibold text-stone-900 mb-2">
              No groups yet! 🎄
            </Text>
            <Text className="text-stone-600 text-center mb-6">
              Create a group to start your Secret Santa exchange
            </Text>
            <TouchableOpacity
              onPress={handleCreateGroup}
              className="bg-emerald-600 px-8 py-4 rounded-xl active:scale-95"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-lg">
                Create Your First Group
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          groups.map(group => {
            const assignment = getMyAssignment(group);
            return (
              <View key={group.id} className="bg-white rounded-2xl mb-4 overflow-hidden border-2 border-stone-200">
                <TouchableOpacity 
                  onPress={() => handleGroupDetails(group)}
                  activeOpacity={0.7}
                >
                  <View className="p-6">
                    <View className="mb-4">
                      <View className="flex-row items-center mb-2">
                        <Text className="text-3xl mr-3">{group.emoji}</Text>
                        <Text className="text-xl font-bold text-stone-900 flex-1">
                          {group.name}
                        </Text>
                        <Ionicons name="chevron-forward" size={24} color="#A8A29E" />
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="people" size={16} color="#78716C" />
                        <Text className="text-stone-600 ml-2">
                          {group.members.length} participants
                        </Text>
                        {group.budget && (
                          <>
                            <Text className="text-stone-400 mx-2">•</Text>
                            <Ionicons name="cash-outline" size={16} color="#78716C" />
                            <Text className="text-stone-600 ml-1">
                              ${group.budget} budget
                            </Text>
                          </>
                        )}
                      </View>
                    </View>

                    {assignment ? (
                      <View 
                        className="bg-stone-50 rounded-xl p-5 border-2" 
                        style={{ 
                          borderColor: group.accent === 'emerald' ? '#D1FAE5' : 
                                     group.accent === 'red' ? '#FECACA' : '#FED7AA' 
                        }}
                      >
                        <View className="flex-row items-center mb-3">
                          <View 
                            className="w-8 h-8 rounded-lg items-center justify-center" 
                            style={{ backgroundColor: getAccentColor(group.accent) }}
                          >
                            <Ionicons name="gift" size={16} color="#fff" />
                          </View>
                          <Text className="text-xs text-stone-600 uppercase ml-2 tracking-widest">
                            Your Secret Assignment
                          </Text>
                        </View>
                        <Text className="text-2xl font-bold text-stone-900 mb-4">
                          {assignment.receiverName}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleViewWishlist(group, assignment)}
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
                    ) : (
                      <View className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                        <View className="flex-row items-center">
                          <Ionicons name="time-outline" size={20} color="#F59E0B" />
                          <Text className="text-amber-800 ml-2 flex-1">
                            Waiting for Secret Santa matching...
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}

        <View className="h-20" />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        onPress={handleCreateGroup}
        className="absolute right-6 bottom-6 w-14 h-14 rounded-full items-center justify-center active:scale-110 shadow-lg"
        style={{ backgroundColor: '#059669' }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}