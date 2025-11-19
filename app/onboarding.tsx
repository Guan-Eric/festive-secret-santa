import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const screens = [
    {
      title: "Organize Secret Santa",
      subtitle: "Gift Exchanges Made Simple",
      description: "Create groups and get matched anonymously with friends, family, or coworkers",
      emoji: "🎁",
    },
    {
      title: "Build Your Wishlist",
      subtitle: "Find the Perfect Gifts",
      description: "Search millions of products on Amazon and create wishlists for each group",
      emoji: "❤️",
    },
    {
      title: "Buy the Perfect Gift",
      subtitle: "Support Our App",
      description: "View your match's wishlist and shop on Amazon. We earn a small commission to keep the app free!",
      emoji: "🛒",
    }
  ];

  const currentScreen = screens[currentIndex];

  const handleNext = () => {
    if (currentIndex < screens.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-red-50 via-stone-50 to-emerald-50">
      <SafeAreaView className="flex-1">
        {/* Skip Button */}
        {currentIndex < screens.length - 1 && (
          <View className="px-6 pt-4">
            <TouchableOpacity onPress={handleSkip}>
              <Text className="text-stone-500 text-sm text-right">Skip</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        <View className="flex-1 justify-center items-center px-8">
          {/* Emoji Illustration */}
          <View className="mb-12">
            <Text className="text-9xl text-center">{currentScreen.emoji}</Text>
          </View>

          {/* Icon Badge */}
          <View className="bg-gradient-to-br from-red-500 to-emerald-600 rounded-2xl p-3 mb-6">
            <Ionicons name="gift" size={32} color="#fff" />
          </View>

          {/* Text Content */}
          <View className="items-center space-y-4">
            <Text className="text-3xl font-bold text-stone-900 text-center mb-2">
              {currentScreen.title}
            </Text>
            
            <Text className="text-xl font-semibold text-emerald-700 text-center mb-4">
              {currentScreen.subtitle}
            </Text>
            
            <Text className="text-base text-stone-600 text-center leading-relaxed max-w-sm">
              {currentScreen.description}
            </Text>
          </View>

          {/* Dots Indicator */}
          <View className="flex-row gap-2 mt-16">
            {screens.map((_, idx) => (
              <View
                key={idx}
                className={`h-2 rounded-full ${
                  idx === currentIndex 
                    ? 'w-8 bg-amber-500' 
                    : 'w-2 bg-stone-300'
                }`}
              />
            ))}
          </View>
        </View>

        {/* Bottom Button */}
        <View className="px-6 pb-8">
          <TouchableOpacity
            onPress={handleNext}
            className="py-4 rounded-xl items-center active:scale-95"
            activeOpacity={0.8}
            style={{ backgroundColor: currentIndex === screens.length - 1 ? '#EF4444' : '#059669' }}
          >
            <View className="flex-row items-center">
              <Text className="text-white font-bold text-lg mr-2">
                {currentIndex === screens.length - 1 ? "Get Started" : "Next"}
              </Text>
              {currentIndex < screens.length - 1 && (
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}