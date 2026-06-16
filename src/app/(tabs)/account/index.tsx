import TouchableScale from '@/components/touchable-scale';
import { router, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import RemixIcon, { IconName } from 'react-native-remix-icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Text } from 'react-native-ui-lib';
// Import authClient Anda
import { useAuth } from '@/context/auth-context';
import { authClient } from '@/lib/auth-client';
// Interface untuk struktur data menu
interface MenuItem {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
    requireAdmin?: boolean; // Tambahan field untuk mengecek hak akses
}




export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { user } = useAuth()

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Cek apakah user adalah admin atau owner
    const isAdmin = user?.role === 'admin' || user?.role === 'owner';

    // 2. Fungsi Sign Out
    const handleSignOut = async () => {
        Alert.alert(
            "Konfirmasi",
            "Apakah Anda yakin ingin keluar?",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Ya, Keluar",
                    style: "destructive",
                    onPress: async () => {
                        setIsLoggingOut(true);
                        try {
                            const { error } = await authClient.signOut();
                            if (error) throw error;

                            // Redirect ke halaman login setelah berhasil logout
                            // Sesuaikan rute "/login" dengan struktur navigasi Expo Router Anda
                            router.replace('/');
                        } catch (err) {
                            Alert.alert("Error", "Gagal melakukan sign out");
                        } finally {
                            setIsLoggingOut(false);
                        }
                    }
                }
            ]
        );
    };

    // 3. Data Menu Profil Dinamis
    const menuData: MenuSection[] = [
        {
            title: 'PENGATURAN SISTEM',
            items: [
                { id: '1', icon: 'settings-3-line', title: 'Preferensi', subtitle: 'Atur tampilan & notifikasi' },
            ],
            requireAdmin: false, // Semua user bisa melihat ini
        },
        {
            title: 'DATA MASTER & PERSEDIAAN',
            items: [
                { id: '2', icon: 'box-3-line', title: 'Master Item & Stok', subtitle: 'Katalog barang dan jumlah' },
                { id: '3', icon: 'archive-line', title: 'Kategori & Klasifikasi', subtitle: 'Pengelompokan tipe aset' },
                { id: '4', icon: 'map-pin-line', title: 'Lokasi', subtitle: 'Daftar gedung atau ruangan' },
            ],
            requireAdmin: true, // Hanya admin/owner
        },
        {
            title: 'ADMINISTRASI ORGANISASI',
            items: [
                { id: '5', icon: 'team-line', title: 'Departemen & Divisi', subtitle: 'Struktur unit kerja' },
                { id: '6', icon: 'user-settings-line', title: 'Pengguna & Tim', subtitle: 'Kelola akun dan anggota' },
                { id: '7', icon: 'shield-keyhole-line', title: 'Role & Hak Akses', subtitle: 'Atur izin fitur aplikasi' },
                { id: '8', icon: 'history-line', title: 'Audit Log', subtitle: 'Riwayat aktivitas sistem' },
            ],
            requireAdmin: true, // Hanya admin/owner
        },
    ];

    // Filter menu berdasarkan role user
    const filteredMenuData = menuData.filter(section =>
        !section.requireAdmin || (section.requireAdmin && isAdmin)
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Tabs.Screen options={{ headerShown: false }} />

            <View style={[styles.headerBackground, { paddingTop: insets.top }]}>
                <View style={styles.headerBlob} />
                <Text style={styles.pageTitle}>Profile</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* --- Bagian Info User --- */}
                <View style={styles.userInfoContainer}>
                    <View style={styles.userProfileRow}>
                        {/* Avatar Dinamis */}
                        <Image
                            source={{
                                uri: user?.image || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User') + '&background=random'
                            }}
                            style={styles.avatar}
                        />

                        {/* Nama & Email Dinamis */}
                        <View style={styles.userData}>
                            <Text style={styles.userName} numberOfLines={1}>
                                {user?.name || 'Memuat...'}
                            </Text>
                            <Text style={styles.userEmail} numberOfLines={1}>
                                {user?.email || ''}
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
                            <RemixIcon name="edit-box-line" size={20} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- Bagian List Menu (Terfilter) --- */}
                <View style={styles.whiteBody}>
                    {filteredMenuData.map((section, sectionIndex) => (
                        <View key={sectionIndex} style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>

                            {section.items.map((item) => (
                                <TouchableScale key={item.id} style={styles.menuItem}>
                                    <View style={styles.menuIconContainer}>
                                        <RemixIcon name={item.icon as IconName} size={22} color={Colors.primary} />
                                    </View>
                                    <View style={styles.menuTextContainer}>
                                        <Text style={styles.menuTitle}>{item.title}</Text>
                                        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                                    </View>
                                    <RemixIcon name="arrow-right-s-line" size={24} color={Colors.black} />
                                </TouchableScale>
                            ))}
                        </View>
                    ))}

                    {/* --- Tombol Sign Out --- */}
                    <TouchableOpacity
                        style={styles.logoutButton}
                        activeOpacity={0.8}
                        onPress={handleSignOut}
                        disabled={isLoggingOut}
                    >
                        <Text style={styles.logoutText}>
                            {isLoggingOut ? "Keluar..." : "Sign Out"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary, // Latar belakang dasar diset ke primary (Biru)
    },

    // Header Background & Ornamen
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 250,
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        zIndex: 0,
        overflow: 'hidden',
    },
    headerBlob: {
        position: 'absolute',
        top: -40,
        right: -50,
        width: 200,
        height: 200,
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Warna biru lebih terang/transparan
        borderRadius: 100,
        transform: [{ scaleX: 1.5 }, { rotate: '45deg' }],
    },
    pageTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '700',
        marginTop: 20,
    },

    // Konten Scroll
    scrollContent: {
        flexGrow: 1,
        paddingTop: 100, // Memberikan ruang agar Profile Picture berada di bawah judul
    },

    // User Info (Area Biru)
    userInfoContainer: {
        paddingHorizontal: 20,
        marginBottom: 25,
        zIndex: 1,
    },
    userProfileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 65,
        height: 65,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    userData: {
        flex: 1,
        marginLeft: 15,
    },
    userName: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    userEmail: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        fontWeight: '400',
    },
    editButton: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // White Body (Area Daftar Menu)
    whiteBody: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 130, // Ruang lega untuk Bottom Navbar
    },

    // Section Menu
    sectionContainer: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.black,
        marginBottom: 15,
        letterSpacing: 0.5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 5,
    },
    menuIconContainer: {
        width: 45,
        height: 45,
        backgroundColor: '#f0f9ff', // Biru sangat pudar agar icon menonjol
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.black,
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
        color: Colors.gray,
        fontWeight: '400',
    },

    // Logout Button
    logoutButton: {
        backgroundColor: Colors.danger, // Merah dari theme Anda
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: Colors.danger,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    logoutText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});