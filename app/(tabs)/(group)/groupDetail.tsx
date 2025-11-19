// app/(tabs)/(group)/groupDetail.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../firebase';
import { matchSecretSantas } from '../../../services/secretSantaMatcher';
import { Group } from '../../../types';

export default function GroupDetailScreen() {
  const { groupId } = useLocalSearchParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const router = useRouter();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    if (!groupId) return;
    
    try {
      const groupDoc = await getDoc(doc(db, 'groups', groupId as string));
      if (groupDoc.exists()) {
        setGroup({ id: groupDoc.id, ...groupDoc.data() } as Group);
      }
    } catch (error) {
      console.error('Error loading group:', error);
      Alert.alert('Error', 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchSecretSantas = async () => {
    if (!group || group.members.length < 2) {
      Alert.alert('Not Enough Members', 'You need at least 2 members to match Secret Santas!');
      return;
    }

    Alert.alert(
      'Match Secret Santas?',
      `This will randomly assign Secret Santas for ${group.members.length} members. This action cannot be undone!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Match Now',
          style: 'default',
          onPress: async () => {
            setMatching(true);
            try {
              const assignments = matchSecretSantas(group.members);
              
              await updateDoc(doc(db, 'groups', group.id), {
                matched: true,
                assignments,
              });

              Alert.alert('🎅 Success!', 'Secret Santas have been matched! Everyone can now see their assignments.');
              loadGroup();
            } catch (error: any) {
              console.error('Error matching:', error);
              Alert.alert('Error', error.message || 'Failed to match Secret Santas');
            } finally {
              setMatching(false);
            }
          }
        }
      ]
    );
  };

  const handleShareGroup = async () => {
    if (!group) return;

    try {
      await Share.share({
        message: `🎄 You're invited to join "${group.name}" Secret Santa exchange!\n\n` +
                 `Join the festive fun and surprise your friends with the perfect gift! 🎁\n\n` +
                 `Download the Secret Santa app to join!`,
        title: `Join ${group.name}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-stone-50 items-center justify-center">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  if (!group) {
    return (
      <View className="flex-1 bg-stone-50 items-center justify-center">
        <Text className="text-stone-600">Group not found</Text>
      </View>
    );
  }

  const isCreator = group.createdBy === userId;

  return (
    <View className="flex-1 bg-stone-50">
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
                {group.emoji} {group.name}
              </Text>
              <Text className="text-white/70 text-sm">
                Group Details
              </Text>
            </View>
            <TouchableOpacity 
              onPress={handleShareGroup}
              className="w-12 h-12 bg-white/15 rounded-2xl items-center justify-center border-2 border-white/30"
            >
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Group Info */}
        <View className="bg-white rounded-2xl p-6 mb-4 border-2 border-stone-200">
          <Text className="text-sm text-stone-500 uppercase tracking-wider mb-4">
            Group Information
          </Text>
          
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="people" size={20} color="#78716C" />
              <Text className="text-stone-900 font-semibold ml-2">
                {group.members.length} Participants
              </Text>
            </View>
            {group.members.map((member, index) => (
              <Text key={index} className="text-stone-600 ml-7">
                • {member.name} {member.userId === group.createdBy && '(Creator)'}
              </Text>
            ))}
          </View>

          {group.budget && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="cash-outline" size={20} color="#78716C" />
              <Text className="text-stone-900 font-semibold ml-2">
                Budget: ${group.budget}
              </Text>
            </View>
          )}

          {group.exchangeDate && (
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={20} color="#78716C" />
              <Text className="text-stone-900 font-semibold ml-2">
                Exchange: {group.exchangeDate}
              </Text>
            </View>
          )}
        </View>

        {/* Matching Status */}
        {group.matched ? (
          <View className="bg-emerald-50 rounded-2xl p-6 mb-4 border-2 border-emerald-200">
            <View className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={24} color="#059669" />
              <Text className="text-emerald-900 font-bold text-lg ml-2">
                Secret Santas Matched!
              </Text>
            </View>
            <Text className="text-emerald-700">
              Everyone has been assigned their Secret Santa. Check the main screen to see who you got! 🎅
            </Text>
          </View>
        ) : (
          <View className="bg-amber-50 rounded-2xl p-6 mb-4 border-2 border-amber-200">
            <View className="flex-row items-center mb-3">
              <Ionicons name="time-outline" size={24} color="#F59E0B" />
              <Text className="text-amber-900 font-bold text-lg ml-2">
                Not Matched Yet
              </Text>
            </View>
            <Text className="text-amber-700 mb-4">
              {isCreator 
                ? `You can match Secret Santas once you have at least 2 members. Currently: ${group.members.length} members.`
                : 'Waiting for the group creator to match Secret Santas.'}
            </Text>
            {isCreator && group.members.length >= 2 && (
              <TouchableOpacity
                onPress={handleMatchSecretSantas}
                disabled={matching}
                className="bg-amber-600 py-4 rounded-xl items-center active:scale-95"
                activeOpacity={0.8}
              >
                {matching ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View className="flex-row items-center">
                    <Ionicons name="shuffle" size={20} color="#fff" />
                    <Text className="text-white font-bold text-lg ml-2">
                      Match Secret Santas Now!
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Invite Instructions */}
        <LinearGradient
          colors={['rgba(234, 179, 8, 0.2)', 'rgba(249, 115, 22, 0.2)']}
          className="rounded-2xl p-5 mb-6 border-2 border-yellow-500/30"
        >
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">💡</Text>
            <View className="flex-1">
              <Text className="text-stone-900 font-bold mb-2">
                How to add members:
              </Text>
              <Text className="text-stone-700 text-sm">
                1. Share this group using the share button above{'\n'}
                2. Ask members to download the Secret Santa app{'\n'}
                3. They can request to join using your email{'\n'}
                4. Once everyone joins, match Secret Santas!
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}