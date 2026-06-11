import { setupTheme } from "@/constant/theme";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Colors, LoaderScreen, View } from "react-native-ui-lib";
// 1. IMPORT SafeAreaProvider
import { SafeAreaProvider } from 'react-native-safe-area-context';

setupTheme();

function RootLayoutNav() {
  const { isAuthenticated, isChecking } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isChecking) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (isAuthenticated && !inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, isChecking, segments]);

  if (isChecking) {
    return (
      <View flex bg-white>
        <LoaderScreen message="Menyiapkan aplikasi..." overlay backgroundColor={Colors.white} color={Colors.blue30} />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    // 2. BUNGKUS DENGAN SafeAreaProvider
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}