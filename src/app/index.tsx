import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,

  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacings, Text, Toast, View } from 'react-native-ui-lib';
// Import komponen kustom (sesuaikan path dengan struktur folder Anda)
import Logo from '@/components/logo';


// Import context & service
import OptiButton from '@/components/opti-button';
import OptiInput from '@/components/opti-input';
import { useAuth } from '@/context/auth-context';
import { AuthService } from '@/services/auth';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State untuk mengontrol Komponen Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState(Colors.danger || Colors.red30);

  const { isAuthenticated } = useAuth(); // Meskipun tidak dipakai langsung di sini, tetap dipertahankan

  // Fungsi helper untuk memicu Toast
  const displayToast = (message: string, color: string = Colors.danger || Colors.red30) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  const handleLogin = async () => {
    // 1. Validasi Input Kosong
    if (!email || !password) {
      displayToast('Email dan Password wajib diisi');
      return;
    }

    // 2. Validasi Format Email (Menggantikan validate={['email']} dari TextField)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      displayToast('Email tidak valid');
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthService.login({
        email,
        password,
      });

      if (result) {
        displayToast('Login Berhasil!', Colors.primary || Colors.green30);
        // Redirect akan ditangani otomatis oleh _layout.tsx Anda berkat useEffect
      }
    } catch (error: any) {
      displayToast(error.message || 'Login Gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

          {/* Komponen Logo */}
          <Logo />

          {/* Teks Judul dan Subjudul */}
          <View marginB-35>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>
              I am happy to see. You can continue to sign in for use our services
            </Text>
          </View>

          {/* Input Email */}
          <OptiInput
            label="E-Mail"
            required={true}
            placeholder="Username or Email"
            iconName="ri-mail-line"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!isLoading} // Nonaktifkan input saat loading
          />

          {/* Input Password */}
          <OptiInput
            label="Password"
            required={true}
            placeholder="Enter Your Password"
            iconName="ri-lock-line"
            isPassword={true}
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />

          {/* Lupa Password */}
          <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>

          {/* Tombol Login */}
          <OptiButton
            title={isLoading ? 'Memproses...' : 'Signin'}
            onPress={handleLogin}
            disabled={isLoading}
            style={isLoading ? { opacity: 0.7 } : {}} // Beri efek visual saat loading
          />

          {/* Teks Kaki (Footer) */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {"By continuing, you're agreeing to our customer "}
              <Text style={styles.boldText}>terms of service</Text>
              {", "}
              <Text style={styles.boldText}>privacy policy</Text>
              {" and "}
              <Text style={styles.boldText}>cookie policy</Text>
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Komponen Toast dari UI Lib Anda */}
      <Toast
        visible={showToast}
        position="top"
        message={toastMessage}
        backgroundColor={toastColor}
        autoDismiss={3000}
        onDismiss={() => setShowToast(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    paddingHorizontal: Spacings.s5,
    paddingTop: 50,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    lineHeight: 22,
  },
  forgotPasswordText: {
    color: Colors.gray,
    textAlign: 'right',
    marginTop: -10,
    marginBottom: 25,
    fontSize: 14,
  },
  footerContainer: {
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  footerText: {
    color: Colors.gray,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: Colors.black,
  },
});