import { setupTheme } from "@/constant/theme";
import { AuthService } from "@/services/auth";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { Colors, LoaderScreen, View } from "react-native-ui-lib";

// Inisialisasi tema UI Lib Anda
setupTheme();

export default function RootLayout() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // 1. Cek sesi ke backend Next.js saat aplikasi pertama kali dibuka
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await AuthService.getSession();
        if (session && session.status === 'success') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();
  }, []);

  // 2. Logika Redirect (Perlindungan Rute)
  useEffect(() => {
    if (isChecking) return; // Jangan lakukan apa-apa jika masih loading

    // Cek apakah user sedang berada di folder /dashboard
    const inAuthGroup = segments[0] === 'home';

    if (isAuthenticated && !inAuthGroup) {
      // Sudah login, tapi di halaman luar (seperti halaman login) -> Lempar ke dashboard
      router.replace('/home/index');
    } else if (!isAuthenticated && inAuthGroup) {
      // Belum login, tapi maksa masuk ke dashboard -> Lempar ke halaman login
      router.replace('/');
    }
  }, [isAuthenticated, isChecking, segments]);

  // 3. Tampilan Loading saat mengecek sesi
  if (isChecking) {
    return (
      <View flex bg-white>
        <LoaderScreen
          message="Menyiapkan aplikasi..."
          overlay
          backgroundColor={Colors.white}
          color={Colors.blue30}
        />
      </View>
    );
  }

  // 4. Struktur Stack Navigasi Anda
  return (
    <Stack>
      {/* Halaman Login */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Halaman Dashboard */}
      <Stack.Screen
        name="home/index"
        options={{
          headerShown: false, // Sembunyikan header default Stack agar Anda bisa membuat header custom di dalam halamannya
          animation: 'fade'   // Animasi transisi yang lebih halus saat pindah dari Login ke Dashboard
        }}
      />
    </Stack>
  );
}