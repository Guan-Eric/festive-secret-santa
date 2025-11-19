import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../../firebase.js';

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState('');
  const [budget, setBudget] = useState('');
  const [exchangeDate, setExchangeDate] = useState('');
  const [emails, setEmails] = useState(['']);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const removeEmail = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert('Please enter a group name! 🎄');
      return;
    }

    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      const validEmails = emails.filter(e => e.trim() !== '');

      const groupData = {
        name: groupName,
        budget: budget || null,
        exchangeDate: exchangeDate || null,
        createdBy: userId,
        memberEmails: validEmails,
        memberIds: [userId],
        members: [{ userId, name: auth.currentUser?.displayName || 'You' }],
        matched: false,
        createdAt: serverTimestamp(),
        emoji: ['🎄', '⛄', '🎁', '🔔', '⭐'][Math.floor(Math.random() * 5)]
      };

      await addDoc(collection(db, 'groups'), groupData);
      
      // TODO: Send email invitations to members
      
      alert('🎅 Group created successfully! Ho ho ho!');
      router.back();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Error creating group: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-red-950">
        <SafeAreaView>
          <View className="flex-row items-center mb-2">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-12 h-12 bg-white/15 rounded-2xl items-center justify-center border-2 border-white/30 mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-3xl font-bold text-white">
                🎄 Create Group
              </Text>
              <Text className="text-white/70 text-sm">
                Start a festive exchange
              </Text>
            </View>
          </View>
        </SafeAreaView>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Group Name */}
        <View className="mb-6">
          <Text className="text-white font-bold text-sm mb-3 ml-2">
            🎁 GROUP NAME
          </Text>
          <View className="bg-white/15 border-2 border-white/30 rounded-2xl px-5 py-4">
            <TextInput
              placeholder="e.g., Office Secret Santa 2025"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={groupName}
              onChangeText={setGroupName}
              className="text-white text-lg font-semibold"
            />
          </View>
        </View>

        {/* Budget */}
        <View className="mb-6">
          <Text className="text-white font-bold text-sm mb-3 ml-2">
            💰 BUDGET (OPTIONAL)
          </Text>
          <View className="bg-white/15 border-2 border-white/30 rounded-2xl px-5 py-4 flex-row items-center">
            <Text className="text-white text-lg font-bold mr-2">$</Text>
            <TextInput
              placeholder="e.g., 50"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
              className="flex-1 text-white text-lg font-semibold"
            />
          </View>
        </View>

        {/* Exchange Date */}
        <View className="mb-6">
          <Text className="text-white font-bold text-sm mb-3 ml-2">
            📅 EXCHANGE DATE (OPTIONAL)
          </Text>
          <View className="bg-white/15 border-2 border-white/30 rounded-2xl px-5 py-4">
            <TextInput
              placeholder="e.g., December 25, 2025"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={exchangeDate}
              onChangeText={setExchangeDate}
              className="text-white text-lg font-semibold"
            />
          </View>
        </View>

        {/* Email Invitations */}
        <View className="mb-6">
          <Text className="text-white font-bold text-sm mb-3 ml-2">
            ✉️ INVITE PARTICIPANTS
          </Text>
          {emails.map((email, index) => (
            <View key={index} className="mb-3 flex-row items-center">
              <View className="flex-1 bg-white/15 border-2 border-white/30 rounded-2xl px-5 py-4">
                <TextInput
                  placeholder="email@example.com"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={email}
                  onChangeText={(value) => updateEmail(index, value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="text-white text-lg font-semibold"
                />
              </View>
              {emails.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeEmail(index)}
                  className="ml-3 w-12 h-12 bg-red-500/30 rounded-xl items-center justify-center border-2 border-red-400/50"
                >
                  <Ionicons name="trash" size={20} color="#F87171" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity
            onPress={addEmailField}
            className="bg-white/10 border-2 border-dashed border-white/30 rounded-2xl py-4 items-center active:scale-95"
          >
            <Text className="text-white/70 font-bold">+ Add Another Email</Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">ℹ️</Text>
            <Text className="flex-1 text-white/80 text-sm">
              Participants will receive an email invitation to join. Once everyone joins, you can match Secret Santas! 🎅
            </Text>
          </View>

        {/* Create Button */}
        <TouchableOpacity
          onPress={handleCreateGroup}
          disabled={loading}
          className="bg-white py-5 rounded-2xl items-center mb-8 border-4 border-yellow-400/50 shadow-2xl active:scale-95"
          activeOpacity={0.8}
        >
          <Text className="text-gray-900 font-bold text-xl">
            {loading ? '🎅 Creating...' : '🎁 Create Group & Send Invites'}
          </Text>
        </TouchableOpacity>

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}