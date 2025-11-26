import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../../firebase';
import {
  acceptGroupInvite,
  declineGroupInvite,
  subscribeToUserGroups,
  subscribeToUserInvites
} from '../../../services/groupService';
import { Assignment, Group, GroupInvite } from '../../../types/index';

export default function GroupsScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [invites, setInvites] = useState<GroupInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingInvite, setProcessingInvite] = useState<string | null>(null);
  const router = useRouter();
  const userId = auth.currentUser?.uid;
  const userEmail = auth.currentUser?.email;

  useEffect(() => {
    if (!userId || !userEmail) return;

    // Subscribe to user's groups
    const unsubscribeGroups = subscribeToUserGroups(userId, (groupsData) => {
      setGroups(groupsData);
      setLoading(false);
    });

    // Subscribe to user's invites
    const unsubscribeInvites = subscribeToUserInvites(userEmail, (invitesData) => {
      setInvites(invitesData);
    });

    return () => {
      unsubscribeGroups();
      unsubscribeInvites();
    };
  }, [userId, userEmail]);

  const handleAcceptInvite = async (invite: GroupInvite) => {
    if (!userId || !userEmail) return;

    Alert.alert(
      'Accept Invite?',
      `Join "${invite.groupName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            setProcessingInvite(invite.id);
            try {
              await acceptGroupInvite(
                invite.id,
                invite.groupId,
                userId,
                auth.currentUser?.displayName || 'User',
                userEmail
              );
              Alert.alert('Success', `You've joined ${invite.groupName}! 🎉`);
            } catch (error) {
              console.error('Error accepting invite:', error);
              Alert.alert('Error', 'Failed to accept invite');
            } finally {
              setProcessingInvite(null);
            }
          }
        }
      ]
    );
  };

  const handleDeclineInvite = async (invite: GroupInvite) => {
    Alert.alert(
      'Decline Invite?',
      `Decline invitation to "${invite.groupName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            setProcessingInvite(invite.id);
            try {
              await declineGroupInvite(invite.id, invite.groupId, userId as string);
            } catch (error) {
              console.error('Error declining invite:', error);
              Alert.alert('Error', 'Failed to decline invite');
            } finally {
              setProcessingInvite(null);
            }
          }
        }
      ]
    );
  };

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
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-white mb-1">
                My Groups
              </Text>
              <Text className="text-white/80 text-base">
                Your gift exchanges 🎁
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/(group)/settings')}
              className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center ml-4"
            >
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Pending Invites Section */}
        {invites.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="mail" size={20} color="#78716C" />
              <Text className="text-lg font-bold text-stone-900 ml-2">
                Pending Invites ({invites.length})
              </Text>
            </View>
            
            {invites.map(invite => (
              <View key={invite.id} className="bg-white rounded-2xl p-5 mb-3 border-2 border-amber-200">
                <View className="flex-row items-start mb-4">
                  <Text className="text-4xl mr-3">{invite.groupEmoji}</Text>
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-stone-900 mb-1">
                      {invite.groupName}
                    </Text>
                    <Text className="text-stone-600 text-sm">
                      Invited by {invite.invitedByName}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => handleAcceptInvite(invite)}
                    disabled={processingInvite === invite.id}
                    className="flex-1 bg-emerald-600 py-3 rounded-xl items-center active:scale-95"
                    activeOpacity={0.8}
                  >
                    {processingInvite === invite.id ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={18} color="#fff" />
                        <Text className="text-white font-bold ml-2">Accept</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleDeclineInvite(invite)}
                    disabled={processingInvite === invite.id}
                    className="flex-1 bg-red-50 py-3 rounded-xl items-center border-2 border-red-200 active:scale-95"
                    activeOpacity={0.8}
                  >
                    {processingInvite === invite.id ? (
                      <ActivityIndicator color="#991B1B" size="small" />
                    ) : (
                      <View className="flex-row items-center">
                        <Ionicons name="close-circle" size={18} color="#991B1B" />
                        <Text className="text-red-900 font-bold ml-2">Decline</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Groups Section */}
        {groups.length === 0 && invites.length === 0 ? (
          <View className="items-center py-20">
            <Image
              source={require('../../../assets/images/secret-santa-logo.png')}
              style={{ width: 100, height: 100, marginBottom: 24 }}
              resizeMode="contain"
            />
            <Text className="text-2xl font-semibold text-stone-900 mb-2">
              No groups yet! 🎄
            </Text>
            <Text className="text-stone-600 text-center mb-6 px-8">
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
        ) : groups.length > 0 ? (
          <>
            {invites.length > 0 && (
              <View className="flex-row items-center mb-3">
                <Ionicons name="people" size={20} color="#78716C" />
                <Text className="text-lg font-bold text-stone-900 ml-2">
                  My Groups ({groups.length})
                </Text>
              </View>
            )}
            {groups.map(group => {
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
            })}
          </>
        ) : null}

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