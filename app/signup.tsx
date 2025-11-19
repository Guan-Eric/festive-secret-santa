import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebase';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert('Please fill in all fields! 🎄');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      router.replace('/(tabs)/(group)/group');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
    
        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 px-6 justify-center"
          >
            {/* Header */}
            <View className="items-center mb-12">
              <Text className="text-8xl mb-4">🎄</Text>
              <Text className="text-5xl font-bold text-white mb-2">
                Join Us!
              </Text>
              <Text className="text-white/70 text-lg">
                ⭐ Create your festive account 🎁
              </Text>
            </View>

            {/* Input Fields */}
            <View className="mb-6">
              <View className="bg-white/15 border-2 border-white/30 rounded-2xl px-5 py-4 flex-row items-center mb-4">
                <Ionicons name="person" size={24} color="rgba(255,255,255,0.7)" />
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={name}
                  onChangeText={setName}
                  className="flex-1 text-white text-lg ml-3"
                />
              </View>

              <View className="bg-white/15 border-2 border-white/30 rounded-2xl px-5 py-4 flex-row items-center mb-4">
                <Ionicons name="mail" size={24} color="rgba(255,255,255,0.7)" />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="flex-1 text-white text-lg ml-3"
                />
              </View>

              <View className="bg-white/15 border-2 border-white/30 rounded-2xl px-5 py-4 flex-row items-center">
                <Ionicons name="lock-closed" size={24} color="rgba(255,255,255,0.7)" />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  className="flex-1 text-white text-lg ml-3"
                />
              </View>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              className="bg-white py-5 rounded-2xl items-center mb-4 border-4 border-yellow-400/50 active:scale-95"
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#1F2937" />
              ) : (
                <Text className="text-gray-900 font-bold text-xl">
                  🎁 Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity 
              onPress={() => router.back()}
              className="py-4"
            >
              <Text className="text-white text-center text-base">
                Already have an account?{' '}
                <Text className="font-bold text-yellow-300">
                  Login 🎄
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Decorative Elements */}
            <View className="items-center mt-8">
              <Text className="text-white/40 text-sm">🎅 ❄️ 🎁 ⛄ 🔔 🎅</Text>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
    </View>
  );
}
