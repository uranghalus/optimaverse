import TouchableScale from '@/components/touchable-scale';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import RemixIcon from 'react-native-remix-icon';
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';

export default function AssetScreen() {
    const [activeFilter, setActiveFilter] = useState('Semua');
    // 1. Tambahkan state untuk melacak fokus pada kolom pencarian
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const filters = ['Semua', 'Tersedia', 'Dipinjam', 'Perbaikan', 'Hilang'];

    const dummyAssets = [
        { id: '1', name: 'ThinkPad T14 Gen 3', location: 'Ruang Server Lt. 2', assetId: 'OPT-AST-2026-001', status: 'Rusak' },
        { id: '2', name: 'ThinkPad T14 Gen 3', location: 'Ruang Server Lt. 2', assetId: 'OPT-AST-2026-002', status: 'Tersedia' },
        { id: '3', name: 'ThinkPad T14 Gen 3', location: 'Ruang Server Lt. 2', assetId: 'OPT-AST-2026-003', status: 'Dipinjam' },
        { id: '4', name: 'ThinkPad T14 Gen 3', location: 'Ruang Server Lt. 2', assetId: 'OPT-AST-2026-004', status: 'Tersedia' },
    ];

    const getStatusColor = (status: any) => {
        switch (status) {
            case 'Rusak': return { bg: Colors.statusRusakBg, text: Colors.statusRusakText };
            case 'Tersedia': return { bg: Colors.statusTersediaBg, text: Colors.statusTersediaText };
            case 'Dipinjam': return { bg: Colors.statusDipinjamBg, text: Colors.statusDipinjamText };
            default: return { bg: Colors.bgGray, text: Colors.textLight };
        }
    };

    return (
        <View style={styles.container}>
            {/* === KONFIGURASI APP BAR EXPO ROUTER === */}
            <StatusBar style="dark" />
            <Tabs.Screen
                options={{
                    headerShown: true,
                    title: 'Data Asset',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: 'white',
                    },
                    headerTitleStyle: {
                        color: Colors.black,
                        fontWeight: '700',
                        fontSize: 22,
                    },
                }}
            />

            {/* === BAGIAN STATIS (Header & Filter) === */}
            <View style={styles.headerContainer}>

                {/* Search & Filter Button */}
                <View style={styles.searchRow}>
                    {/* Search Input */}
                    <View
                        style={[
                            styles.searchBox,
                            {
                                // 2. Ubah warna border dan background secara dinamis
                                borderColor: isSearchFocused ? Colors.primary : Colors.lightGray,
                                backgroundColor: isSearchFocused ? 'white' : '#f8f8f8'
                            }
                        ]}
                    >
                        {/* 3. Ikon juga berubah warna saat fokus agar lebih manis */}
                        <RemixIcon
                            name="search-2-line"
                            size={24}
                            color={isSearchFocused ? Colors.primary : Colors.gray}
                        />
                        <TextInput
                            placeholder="Cari Asset"
                            placeholderTextColor={Colors.lightGray}
                            style={[
                                styles.searchInput,
                                { color: isSearchFocused ? Colors.black : '#B0B0B0' }
                            ]}
                            // 4. Deteksi sentuhan (fokus dan lepas fokus)
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                    </View>

                    {/* Filter Button */}
                    <TouchableOpacity style={[styles.filterButton, { backgroundColor: Colors.primary }]} activeOpacity={0.8}>
                        <RemixIcon name="filter-3-line" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Filter Pills (Scroll Horizontal) */}
                <View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {filters.map((item, index) => {
                            const isActive = activeFilter === item;
                            return (
                                <TouchableOpacity key={index} onPress={() => setActiveFilter(item)} activeOpacity={0.7}>
                                    <View
                                        style={[
                                            styles.filterPill,
                                            { borderColor: isActive ? Colors.primary : Colors.lightGray },
                                        ]}
                                    >
                                        <Text style={[styles.pillText, { color: isActive ? Colors.primary : Colors.lightGray }]}>
                                            {item}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>

            {/* === BAGIAN LIST ASSET (Scroll Vertical) === */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {dummyAssets.map((asset) => {
                    const statusColors = getStatusColor(asset.status);
                    return (
                        <TouchableScale
                            key={asset.id}
                            style={[styles.cardContainer, { borderColor: Colors.lightGray }]}
                        >
                            {/* Image Placeholder */}
                            <View style={[styles.imagePlaceholder, { backgroundColor: Colors.primary }]} />

                            {/* Asset Details */}
                            <View style={styles.assetDetails}>
                                <Text style={[styles.assetName, { color: Colors.black }]}>
                                    {asset.name}
                                </Text>

                                <View style={styles.locationRow}>
                                    <RemixIcon name="map-pin-2-line" size={14} color={Colors.gray} />
                                    <Text style={[styles.locationText, { color: Colors.gray }]}>
                                        {asset.location}
                                    </Text>
                                </View>

                                <View style={styles.bottomDetailRow}>
                                    <Text style={[styles.assetIdText, { color: Colors.gray }]}>
                                        {asset.assetId}
                                    </Text>

                                    {/* Status Badge */}
                                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                                        <Text style={[styles.statusText, { color: statusColors.text }]}>
                                            {asset.status}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableScale>
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

    // Header Styles
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'white',
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    searchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 17,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        // Hapus hardcode borderColor dan backgroundColor di sini karena sudah diatur dinamis di atas
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
        padding: 0, // Reset default padding on Android
    },
    filterButton: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Filter Pills Styles
    filterPill: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 1.5,
        backgroundColor: 'white',
    },
    pillText: {
        fontSize: 14,
        fontWeight: '500',
    },

    // List Styles
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 130, // Mengingat ada Custom Tab Bar yang tinggi di bawahnya
    },
    cardContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 11,
        marginBottom: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    imagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 7,
    },
    assetDetails: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    assetName: {
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 20,
        letterSpacing: -0.5,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    locationText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 5,
    },
    bottomDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    assetIdText: {
        fontSize: 14,
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
});