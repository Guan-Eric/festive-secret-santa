// app/(tabs)/(group)/createGroup.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../../firebase';
import { createGroup } from '../../../services/groupService';

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
      if (!userId) throw new Error('Not authenticated');

      const validEmails = emails.filter(e => e.trim() !== '');

      await createGroup({
        name: groupName,
        budget: Number(budget) || undefined,
        exchangeDate: exchangeDate || undefined,
        createdBy: userId,
        memberEmails: validEmails,
        creatorName: auth.currentUser?.displayName || 'You'
      });
      
      alert('🎅 Group created successfully! Ho ho ho!');
      router.back();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Error creating group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-stone-50">
      <SafeAreaView edges={['top']} className="bg-emerald-600">
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
                Create Group
              </Text>
              <Text className="text-white/80 text-sm">
                Start a festive exchange 🎄
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Group Name */}
        <View className="mb-6">
          <Text className="text-stone-900 font-bold text-sm mb-3 ml-2">
            GROUP NAME *
          </Text>
          <View className="bg-white border-2 border-stone-200 rounded-2xl px-5 py-4">
            <TextInput
              placeholder="e.g., Office Secret Santa 2025"
              placeholderTextColor="#A8A29E"
              value={groupName}
              onChangeText={setGroupName}
              className="text-stone-900 text-lg"
            />
          </View>
        </View>

        {/* Budget */}
        <View className="mb-6">
          <Text className="text-stone-900 font-bold text-sm mb-3 ml-2">
            BUDGET (OPTIONAL)
          </Text>
          <View className="bg-white border-2 border-stone-200 rounded-2xl px-5 py-4 flex-row items-center">
            <Text className="text-stone-900 text-lg font-bold mr-2">$</Text>
            <TextInput
              placeholder="e.g., 50"
              placeholderTextColor="#A8A29E"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
              className="flex-1 text-stone-900 text-lg"
            />
          </View>
        </View>

        {/* Exchange Date */}
        <View className="mb-6">
          <Text className="text-stone-900 font-bold text-sm mb-3 ml-2">
            EXCHANGE DATE (OPTIONAL)
          </Text>
          <View className="bg-white border-2 border-stone-200 rounded-2xl px-5 py-4">
            <TextInput
              placeholder="e.g., December 25, 2025"
              placeholderTextColor="#A8A29E"
              value={exchangeDate}
              onChangeText={setExchangeDate}
              className="text-stone-900 text-lg"
            />
          </View>
        </View>

        {/* Email Invitations */}
        <View className="mb-6">
          <Text className="text-stone-900 font-bold text-sm mb-3 ml-2">
            INVITE PARTICIPANTS (OPTIONAL)
          </Text>
          {emails.map((email, index) => (
            <View key={index} className="mb-3 flex-row items-center">
              <View className="flex-1 bg-white border-2 border-stone-200 rounded-2xl px-5 py-4">
                <TextInput
                  placeholder="email@example.com"
                  placeholderTextColor="#A8A29E"
                  value={email}
                  onChangeText={(value) => updateEmail(index, value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="text-stone-900 text-lg"
                />
              </View>
              {emails.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeEmail(index)}
                  className="ml-3 w-12 h-12 bg-red-50 rounded-xl items-center justify-center border-2 border-red-200"
                >
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity
            onPress={addEmailField}
            className="bg-white border-2 border-dashed border-stone-300 rounded-2xl py-4 items-center active:scale-95"
          >
            <Text className="text-stone-600 font-bold">+ Add Another Email</Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View className="bg-emerald-50 rounded-2xl p-5 mb-6 border-2 border-emerald-200">
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">💡</Text>
            <Text className="flex-1 text-emerald-900 text-sm">
              You can add participants now or invite them later. Once everyone joins, you can match Secret Santas! 🎅
            </Text>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          onPress={handleCreateGroup}
          disabled={loading}
          className="bg-emerald-600 py-5 rounded-2xl items-center mb-8 active:scale-95"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-xl">
            {loading ? '🎅 Creating...' : '🎁 Create Group'}
          </Text>
        </TouchableOpacity>

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}