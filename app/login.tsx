import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
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
              <Text className="text-8xl mb-4">🎅</Text>
              <Text className="text-4xl font-bold text-stone-900 mb-2">
                Secret Santa
              </Text>
              <Text className="text-lg text-stone-600">
                Festive Gift Exchange
              </Text>
            </View>

            {/* Input Fields */}
            <View className="mb-6">
              <View className="bg-white border-2 border-stone-200 rounded-xl px-5 py-4 flex-row items-center mb-4">
                <Ionicons name="mail" size={24} color="#78716C" />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#A8A29E"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="flex-1 text-stone-900 text-lg ml-3"
                />
              </View>

              <View className="bg-white border-2 border-stone-200 rounded-xl px-5 py-4 flex-row items-center">
                <Ionicons name="lock-closed" size={24} color="#78716C" />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#A8A29E"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  className="flex-1 text-stone-900 text-lg ml-3"
                />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="py-5 rounded-xl items-center mb-4 active:scale-95"
              style={{ backgroundColor: '#059669' }}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-xl">
                  Login
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <TouchableOpacity 
              onPress={() => router.push('/signup')}
              className="py-4"
            >
              <Text className="text-stone-700 text-center text-base">
                Don't have an account?
                <Text className="font-bold text-emerald-700">
                  Sign up
                </Text>
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </SafeAreaView>
    </View>
  );
}
