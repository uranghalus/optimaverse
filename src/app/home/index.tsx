import { AuthService } from '@/services/auth';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, Colors, LoaderScreen, Text, View } from 'react-native-ui-lib';

export default function HomeScreen() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Ambil data user saat dashboard dibuka
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
            await AuthService.logout();
            // Setelah logout berhasil, lempar kembali ke halaman login
            router.replace('/');
        } catch (error) {
            console.error("Gagal logout:", error);
        }
    };

    if (isLoading) {
        return (
            <View flex bg-white>
                <LoaderScreen color={Colors.blue30} message="Memuat Dashboard..." />
            </View>
        );
    }

    return (
        <View flex padding-20 centerV bg-white>
            <View marginB-40 centerH>
                <Text text30 font-bold blue10 marginB-10>
                    Dashboard
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
            />
        </View>
    );
}