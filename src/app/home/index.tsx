// app/home/index.tsx
import { useAuth } from '@/context/auth-context';
import { AuthService } from '@/services/auth';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, Colors, LoaderScreen, Text, View } from 'react-native-ui-lib';
// 1. Import useAuth dari Context yang sudah kita buat


export default function HomeScreen() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 2. Ambil fungsi setIsAuthenticated dari Context
    const { setIsAuthenticated } = useAuth();

    // Ambil data user saat halaman Home dibuka
    useEffect(() => {
        const fetchUser = async () => {
            const session = await AuthService.getSession();
            if (session && session.status === 'success') {
                setUser(session.data.user);
            }
            setIsLoading(false);
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            // Tampilkan loading saat proses logout berjalan (opsional tapi disarankan)
            setIsLoading(true);

            await AuthService.logout();

            // 3. BERITAHU LAYOUT BAHWA KITA SUDAH LOGOUT!
            setIsAuthenticated(false);

            // Lempar kembali ke halaman login
            router.replace('/');
        } catch (error) {
            console.error("Gagal logout:", error);
            setIsLoading(false); // Matikan loading jika gagal
        }
    };

    if (isLoading) {
        return (
            <View flex bg-white>
                <LoaderScreen color={Colors.blue30} message="Memuat halaman..." />
            </View>
        );
    }

    return (
        <View flex padding-20 centerV bg-white>
            <View marginB-40 centerH>
                <Text text30 font-bold blue10 marginB-10>
                    Home
                </Text>
                <Text text70 grey40>
                    Selamat datang, {user?.name || user?.email || 'User'}!
                </Text>
            </View>

            <Button
                label="Keluar (Logout)"
                size={Button.sizes.large}
                backgroundColor={Colors.red30}
                onPress={handleLogout}
                style={{ borderRadius: 8 }}
            />
        </View>
    );
}