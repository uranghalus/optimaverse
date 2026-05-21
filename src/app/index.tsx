import { useAuth } from "@/context/auth-context";
import { AuthService } from "@/services/auth";
import { router } from "expo-router";
import { useState } from "react";
import { Button, Colors, Text, TextField, Toast, View } from "react-native-ui-lib";

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Tambahkan state untuk mengontrol Komponen Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState(Colors.red30);
  const { setIsAuthenticated } = useAuth();
  // 2. Fungsi helper untuk memicu Toast
  const displayToast = (message: string, color: string = Colors.red30) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      displayToast('Email dan Password wajib diisi');
      return;
    }

    setIsLoading(true);
    try {
      const result = await AuthService.login({ email, password });

      if (result.status === 'success') {
        // Gunakan warna hijau untuk sukses
        displayToast('Login Berhasil!', Colors.green30);
        // 3. BERITAHU LAYOUT BAHWA KITA SUDAH LOGIN!
        setIsAuthenticated(true);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      displayToast(error.message || 'Login Gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View flex padding-20 centerV bg-white>
      <View marginB-40>
        <Text text30 font-bold blue10 marginB-10>
          Selamat Datang
        </Text>
        <Text text70 grey40>
          Silakan masuk ke akun Anda untuk melanjutkan.
        </Text>
      </View>

      <TextField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        enableErrors
        validate={['required', 'email']}
        validationMessage={['Field ini wajib diisi', 'Email tidak valid']}
        showClearButton
        // fo dihapus dari sini
        fieldStyle={{
          borderWidth: 1,
          borderColor: Colors.grey50,
          padding: 16,
          borderRadius: 8, // Tambahan agar sudut membulat
          marginBottom: 10,
        }}
      />

      <TextField
        placeholder="Password"

        value={password}
        onChangeText={setPassword}
        secureTextEntry
        enableErrors
        validate={['required']}
        validationMessage={['Field ini wajib diisi']}
        fieldStyle={{
          borderWidth: 1,
          borderColor: Colors.grey50,
          padding: 16, // Disamakan dengan email (sebelumnya 4)
          borderRadius: 8,
          marginBottom: 20,
        }}
      />

      <Button
        label={isLoading ? 'Memproses...' : 'Masuk'}
        size={Button.sizes.large}
        backgroundColor={Colors.blue30}
        disabled={isLoading}
        onPress={handleLogin}
        marginT-10
      />

      {/* 3. Render komponen Toast di posisi paling bawah */}
      <Toast
        visible={showToast}
        position="top"
        message={toastMessage}
        backgroundColor={toastColor}
        autoDismiss={3000} // Toast akan otomatis hilang dalam 3 detik
        onDismiss={() => setShowToast(false)} // Wajib ada agar state bisa direset
      />
    </View>
  );
}