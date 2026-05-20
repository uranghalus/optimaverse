import { setupTheme } from "@/constant/theme";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Colors, LoaderScreen, View } from "react-native-ui-lib";


setupTheme();

// Komponen ini mengatur navigasi setelah context/state tersedia
function RootLayoutNav() {
  const { isAuthenticated, isChecking } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isChecking) return;

    const inAuthGroup = segments[0] === 'home';

    if (isAuthenticated && !inAuthGroup) {
      router.replace('/home');
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
      <Stack.Screen name="home/index" options={{ headerShown: false, animation: 'fade' }} />
    </Stack>
  );
}

// Komponen Utama Layout
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}