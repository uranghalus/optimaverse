import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { Colors } from 'react-native-ui-lib';

function CustomTabBar({ state, descriptors, navigation }: any) {
    const icons = {
        index: 'home-5-line',
        'asset/index': 'box-3-line',
        'scan/index': 'qr-scan-2-line',
        'approval/index': 'task-line',
        'account/index': 'user-3-line',
    } as const;

    const labels = {
        index: 'Beranda',
        'asset/index': 'Asset',
        'scan/index': '',
        'approval/index': 'Persetujuan',
        'account/index': 'Akun',
    };

    // Mencari rute scan secara spesifik agar bisa dipanggil oleh tombol melayang
    const scanRouteIndex = state.routes.findIndex((r: any) => r.name === 'scan/index');
    const scanRoute = state.routes[scanRouteIndex];

    const onScanPress = () => {
        if (!scanRoute) return;
        const event = navigation.emit({ type: 'tabPress', target: scanRoute.key, canPreventDefault: true });
        if (state.index !== scanRouteIndex && !event.defaultPrevented) {
            navigation.navigate(scanRoute.name);
        }
    };

    return (
        // 1. Wrapper utama harus box-none agar tidak menghalangi klik area kosong
        <View style={styles.absoluteWrapper} pointerEvents="box-none">

            {/* 2. Ini adalah kotak putih Navbar */}
            <View style={styles.whiteBackground}>
                {state.routes.map((route: any, index: number) => {
                    const isFocused = state.index === index;
                    const iconName = icons[route.name as keyof typeof icons];
                    const label = labels[route.name as keyof typeof labels];

                    if (!iconName) return null;

                    // 3. Khusus rute Scan, kita HANYA buatkan ruang kosong (placeholder)
                    // Tombol aslinya kita buat di luar kotak putih ini
                    if (route.name === 'scan/index') {
                        return <View key={index} style={styles.navItem} pointerEvents="none" />;
                    }

                    const onPress = () => {
                        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                        if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                    };

                    return (
                        <TouchableOpacity key={index} style={styles.navItem} activeOpacity={0.8} onPress={onPress}>
                            <Icon name={iconName as any} size={24} color={isFocused ? Colors.primary : '#999999'} />
                            <Text style={[styles.navText, { color: isFocused ? '#333333' : '#999999' }]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* 4. Ini Tombol Scan Aslinya, posisinya MUTLAK di atas kotak putih */}
            <View style={styles.floatingScanContainer} pointerEvents="box-none">
                <TouchableOpacity activeOpacity={0.8} onPress={onScanPress} style={styles.scanButton}>
                    <Icon name="qr-scan-2-line" size={28} color="white" />
                </TouchableOpacity>
            </View>

        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
            <Tabs.Screen name="index" />
            <Tabs.Screen name="asset/index" />
            <Tabs.Screen name="scan/index" />
            <Tabs.Screen name="approval/index" />
            <Tabs.Screen name="account/index" />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    // Menahan seluruh navbar di bawah layar
    absoluteWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'flex-end',
    },
    // Kotak putih
    whiteBackground: {
        borderTopWidth: 0.5,
        height: 70,
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        fontSize: 11,
        marginTop: 4,
        fontWeight: '600',
    },
    // Kontainer ini menahan tombol scan agar pas di tengah atas
    floatingScanContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        // Angka ini mendorong tombol ke atas. Sesuaikan jika kurang naik/turun
        bottom: Platform.OS === 'ios' ? 40 : 30,
    },
    scanButton: {
        width: 58,
        height: 58,
        borderRadius: 15,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        // Efek shadow biru
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 8,
    }
});