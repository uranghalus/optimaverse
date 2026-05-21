import { setupTheme } from "@/constant/theme";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Colors, LoaderScreen, View } from "react-native-ui-lib";

setupTheme();

function RootLayoutNav() {
  const { isAuthenticated, isChecking } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isChecking) return;

    // Ubah pengecekan segment ke '(tabs)'
    const inAuthGroup = segments[0] === '(tabs)';

    if (isAuthenticated && !inAuthGroup) {
      // Jika sudah login tapi belum di dalam tab, arahkan ke tab
      router.replace('/(tabs)');
    } else if (!isAuthenticated && inAuthGroup) {
      // Jika belum login tapi mencoba masuk tab, kembalikan ke index (login)
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
      {/* Layar Login / Unauthenticated */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Layar Tabs / Authenticated (menggantikan home/index) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}