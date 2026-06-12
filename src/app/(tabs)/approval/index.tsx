import TouchableScale from '@/components/touchable-scale';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import RemixIcon, { IconName } from 'react-native-remix-icon';
import { Colors, Text } from 'react-native-ui-lib';
interface ApprovalItem {
    id: string;
    type: string;
    time: string;
    userName: string;
    assetName: string;
    detailIcon: string;
    detailText: string;
    status?: string; // Tanda tanya (?) berarti properti ini opsional
}
export default function ApprovalScreen() {
    const [activeTab, setActiveTab] = useState<'menunggu' | 'riwayat'>('menunggu');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Data Dummy: Menunggu
    const menungguData: ApprovalItem[] = [
        {
            id: '1',
            type: 'Mutasi',
            time: 'Hari ini, 08:30',
            userName: 'Ridha Anggoro - IT Dept',
            assetName: 'Kondom Durex (AST-IT-001)',
            detailIcon: 'map-pin-2-line',
            detailText: 'Gudang A → Ruang Server',
        },
        {
            id: '2',
            type: 'Peminjaman',
            time: 'Hari ini, 08:30',
            userName: 'Andi - Marketing',
            assetName: 'Proyektor Epson (AST-PRJ-42)',
            detailIcon: 'calendar-line',
            detailText: '30 Mei 2026 - 02 Jun 2026',
        },
    ];

    // Data Dummy: Riwayat
    const riwayatData: ApprovalItem[] = [
        {
            id: '3',
            type: 'Mutasi',
            time: 'Kemarin, 14:15',
            userName: 'Budi Santoso - HRD',
            assetName: 'Kursi Hidrolik (AST-HR-012)',
            detailIcon: 'map-pin-2-line',
            detailText: 'Lobby → Ruang Meeting B',
            status: 'Disetujui',
        },
        {
            id: '4',
            type: 'Peminjaman',
            time: '28 Mei 2026, 09:00',
            userName: 'Siti Aisyah - Finance',
            assetName: 'Laptop Dell XPS 13 (AST-FIN-005)',
            detailIcon: 'calendar-line',
            detailText: '28 Mei 2026 - 29 Mei 2026',
            status: 'Ditolak',
        },
    ];

    // Helper: Mendapatkan gaya badge tipe (Mutasi/Peminjaman)
    const getTypeStyles = (type: string) => {
        if (type === 'Mutasi') {
            return { bg: '#e0f2fe', text: '#0284c7', icon: 'drag-move-2-line' };
        }
        return { bg: '#fef3c7', text: '#d97706', icon: 'arrow-left-right-line' };
    };

    // Data yang dirender berdasarkan tab aktif
    const currentData = activeTab === 'menunggu' ? menungguData : riwayatData;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <Tabs.Screen
                options={{
                    headerShown: true,
                    title: 'Persetujuan',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.white },
                    headerTitleStyle: {
                        color: Colors.black,
                        fontWeight: '700',
                        fontSize: 22,
                    },
                }}
            />

            {/* === BAGIAN STATIS (Tab Switcher & Search) === */}
            <View style={styles.headerContainer}>

                {/* 1. Custom Tab Switcher */}
                <View style={styles.tabSwitcherContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            // Terapkan warna background dinamis dari Colors.primary jika aktif
                            activeTab === 'menunggu' && { backgroundColor: Colors.primary, ...styles.activeTabElevation }
                        ]}
                        onPress={() => setActiveTab('menunggu')}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.tabText, { color: activeTab === 'menunggu' ? Colors.white : Colors.primary }]}>
                            Menunggu (2)
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            // Terapkan warna background dinamis dari Colors.primary jika aktif
                            activeTab === 'riwayat' && { backgroundColor: Colors.primary, ...styles.activeTabElevation }
                        ]}
                        onPress={() => setActiveTab('riwayat')}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.tabText, { color: activeTab === 'riwayat' ? Colors.white : Colors.primary }]}>
                            Riwayat
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 2. Search & Filter Bar */}
                <View style={styles.searchRow}>
                    <View
                        style={[
                            styles.searchBox,
                            {
                                borderColor: isSearchFocused ? Colors.primary : Colors.lightGray,
                                backgroundColor: isSearchFocused ? Colors.white : '#f8f8f8'
                            }
                        ]}
                    >
                        <RemixIcon
                            name="search-2-line"
                            size={24}
                            color={isSearchFocused ? Colors.primary : Colors.gray}
                        />
                        <TextInput
                            placeholder="Cari Persetujuan"
                            placeholderTextColor={Colors.lightGray}
                            style={[styles.searchInput, { color: isSearchFocused ? Colors.black : Colors.gray }]}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                    </View>

                    <TouchableOpacity style={[styles.filterButton, { backgroundColor: Colors.primary }]} activeOpacity={0.8}>
                        <RemixIcon name="filter-3-line" size={20} color={Colors.white} />
                    </TouchableOpacity>
                </View>

            </View>

            {/* === BAGIAN LIST KARTU (Scroll Vertical) === */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {currentData.map((item) => {
                    const typeStyle = getTypeStyles(item.type);

                    return (
                        <View key={item.id} style={styles.cardContainer}>

                            {/* Baris 1: Badge Tipe & Waktu */}
                            <View style={styles.cardHeader}>
                                <View style={[styles.typeBadge, { backgroundColor: typeStyle.bg }]}>
                                    <RemixIcon name={typeStyle.icon as IconName} size={14} color={typeStyle.text} />
                                    <Text style={[styles.typeText, { color: typeStyle.text }]}>{item.type}</Text>
                                </View>
                                <Text style={styles.timeText}>{item.time}</Text>
                            </View>

                            {/* Baris 2: Info User */}
                            <View style={styles.infoRow}>
                                <RemixIcon name="user-3-line" size={20} color={Colors.gray} />
                                <Text style={styles.userNameText}>{item.userName}</Text>
                            </View>

                            {/* Baris 3: Info Asset */}
                            <View style={styles.infoRow}>
                                <RemixIcon name="box-3-line" size={20} color={Colors.gray} />
                                <Text style={styles.assetNameText}>{item.assetName}</Text>
                            </View>

                            {/* Baris 4: Info Detail (Lokasi / Tanggal) */}
                            <View style={styles.infoRow}>
                                <RemixIcon name={item.detailIcon as IconName} size={20} color={Colors.primary} />
                                <Text style={styles.detailText}>{item.detailText}</Text>
                            </View>

                            {/* Pembatas */}
                            <View style={styles.divider} />

                            {/* Baris 5: Tombol Aksi ATAU Status Riwayat */}
                            {activeTab === 'menunggu' ? (
                                <View style={styles.actionRow}>
                                    <TouchableScale style={styles.btnTolak}>
                                        <Text style={styles.textBtnTolak}>Tolak</Text>
                                    </TouchableScale>

                                    <TouchableScale style={styles.btnSetuju}>
                                        <Text style={styles.textBtnSetuju}>Setujui</Text>
                                    </TouchableScale>
                                </View>
                            ) : (
                                <View style={styles.statusRow}>
                                    <Text style={styles.statusLabelText}>Status Persetujuan:</Text>
                                    <Text style={[
                                        styles.statusValueText,
                                        { color: item.status === 'Disetujui' ? Colors.statusTersediaText : Colors.danger }
                                    ]}>
                                        {item.status}
                                    </Text>
                                </View>
                            )}

                        </View>
                    );
                })}
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: 'white',
    },

    // Tab Switcher Styles
    tabSwitcherContainer: {
        flexDirection: 'row',
        backgroundColor: '#f0f9ff', // Background biru sangat muda untuk area luar tab
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabElevation: {
        // Hanya efek bayangan, warnanya sekarang dinamis disematkan langsung di TouchableOpacity
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
    },

    // Search Box Styles
    searchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '400',
        padding: 0,
    },
    filterButton: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // List & Card Styles
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 130, // Ruang lega untuk Custom Bottom Nav
    },
    cardContainer: {
        backgroundColor: 'white',
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        borderRadius: 16,
        padding: 16,
        marginBottom: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    typeText: {
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    timeText: {
        fontSize: 13,
        color: '#6b7280',
        fontWeight: '400',
    },

    // Rows Info
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userNameText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        marginLeft: 10,
    },
    assetNameText: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 10,
    },
    detailText: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 10,
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 15,
    },

    // Action Buttons
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btnTolak: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#A71D31',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 6,
    },
    textBtnTolak: {
        color: '#A71D31',
        fontWeight: '600',
        fontSize: 15,
    },
    btnSetuju: {
        flex: 1,
        backgroundColor: '#009DDC', // Primary color Anda
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 6,
    },
    textBtnSetuju: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },

    // Status Row (For Riwayat)
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusLabelText: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    statusValueText: {
        fontSize: 15,
        fontWeight: '700',
    },
});