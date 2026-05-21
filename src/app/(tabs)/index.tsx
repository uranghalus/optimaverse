import TouchableScale from '@/components/touchable-scale';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet } from 'react-native';
import Icon from 'react-native-remix-icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge, Text, View } from 'react-native-ui-lib';


export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View flex bg-white>
            <StatusBar barStyle="light-content" backgroundColor="#00A3E0" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <LinearGradient
                        colors={['#00A3E0', '#0085C9']}
                        style={[styles.headerGradient, { paddingTop: Platform.OS === 'ios' ? insets.top + 10 : insets.top + 20 }]}
                    >
                        <View style={styles.headerTopRow}>
                            <View>
                                <Text style={styles.greetingText}>Good Day For Shopping</Text>
                                <Text style={styles.nameText}>Jack Elliot</Text>
                            </View>
                            <TouchableScale style={styles.bellContainer}>
                                <Icon name="notification-3-line" size={26} color="white" />
                                <View style={styles.badge}>
                                    <Badge
                                        size={16}
                                        label="5"
                                        backgroundColor="white"
                                        labelStyle={styles.badgeLabel}
                                    />
                                </View>
                            </TouchableScale>
                        </View>

                        <Text style={styles.sectionTitle}>Ringkasan Asset</Text>
                    </LinearGradient>
                </View>

                {/* Summary Grid */}
                <View style={styles.summaryGrid}>
                    <View style={styles.gridRow}>
                        <TouchableScale style={[styles.summaryCard, styles.cardMarginRight]}>
                            <View style={styles.cardHeader}>
                                <View style={[styles.iconBox, { backgroundColor: '#00A3E0' }]}>
                                    <Icon name="box-3-line" size={20} color="white" />
                                </View>
                                <Text style={styles.valueText}>50.025</Text>
                            </View>
                            <Text style={styles.labelText}>Total Aset Aktif</Text>
                        </TouchableScale>
                        <TouchableScale style={[styles.summaryCard, styles.cardMarginLeft]}>
                            <View style={styles.cardHeader}>
                                <View style={[styles.iconBox, { backgroundColor: '#4C71B6' }]}>
                                    <Icon name="file-transfer-line" size={20} color="white" />
                                </View>
                                <Text style={styles.valueText}>50.025</Text>
                            </View>
                            <Text style={styles.labelText}>Butuh Approval</Text>
                        </TouchableScale>
                    </View>
                    <View style={styles.gridRow}>
                        <TouchableScale style={[styles.summaryCard, styles.cardMarginRight]}>
                            <View style={styles.cardHeader}>
                                <View style={[styles.iconBox, { backgroundColor: '#696DC2' }]}>
                                    <Icon name="hand-heart-line" size={20} color="white" />
                                </View>
                                <Text style={styles.valueText}>50.025</Text>
                            </View>
                            <Text style={styles.labelText}>Aset Dipinjam</Text>
                        </TouchableScale>
                        <TouchableScale style={[styles.summaryCard, styles.cardMarginLeft]}>
                            <View style={styles.cardHeader}>
                                <View style={[styles.iconBox, { backgroundColor: '#8E579F' }]}>
                                    <Icon name="building-4-line" size={20} color="white" />
                                </View>
                                <Text style={styles.valueText}>50.025</Text>
                            </View>
                            <Text style={styles.labelText}>Stok Menipis</Text>
                        </TouchableScale>
                    </View>
                </View>

                {/* Aktivitas Aset Section */}
                <View style={styles.activityContainer}>
                    <Text style={styles.sectionHeadingDark}>Aktivitas Aset</Text>
                    <View style={styles.activityCardsRow}>
                        <TouchableScale style={[styles.activityCard, styles.cardMarginRight]}>
                            <Icon name="drag-move-2-line" size={26} color="#00A3E0" />
                            <Text style={styles.activityLabel}>Mutasi Asset</Text>
                        </TouchableScale>
                        <TouchableScale style={[styles.activityCard, styles.cardMarginRight, styles.cardMarginLeft]}>
                            <Icon name="hand-heart-line" size={26} color="#A36537" />
                            <Text style={styles.activityLabel}>Pinjam Asset</Text>
                        </TouchableScale>
                        <TouchableScale style={[styles.activityCard, styles.cardMarginLeft]}>
                            <Icon name="delete-bin-4-line" size={26} color="#D68832" />
                            <Text style={styles.activityLabel}>Disposal</Text>
                        </TouchableScale>
                    </View>
                </View>

                {/* Perlu Persetujuan Section */}
                <View style={styles.approvalContainer}>
                    <Text style={styles.sectionHeadingDark}>Perlu Persetujuan</Text>

                    {[1, 2].map((item) => (
                        <TouchableScale key={item} style={styles.approvalCard}>
                            <View style={[styles.approvalIconBox, { backgroundColor: '#696DC2' }]}>
                                <Icon name="hand-heart-line" size={24} color="white" />
                            </View>
                            <View style={styles.approvalContent}>
                                <View style={styles.approvalHeader}>
                                    <Text style={styles.approvalTitle}>Peminjaman Asset</Text>
                                    <Text style={styles.approvalTime}>Baru Saja</Text>
                                </View>
                                <View style={styles.approvalDetails}>
                                    <Icon name="building-4-line" size={14} color="#777777" />
                                    <Text style={[styles.detailText, styles.detailTextMargin]}>Marketing</Text>
                                    <Icon name="box-3-line" size={14} color="#777777" />
                                    <Text style={styles.detailText}>Speaker</Text>
                                </View>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>Menunggu Persetujuan</Text>
                                </View>
                            </View>
                        </TouchableScale>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 100, // Ruang kosong agar konten tidak tertutup oleh bottom nav
    },
    headerContainer: {
        height: 250,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        overflow: 'hidden',
    },
    headerGradient: {
        flex: 1,
        paddingHorizontal: 24,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    greetingText: {
        fontSize: 14,
        color: '#E0F2FE',
        marginBottom: 4,
    },
    nameText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    bellContainer: {
        position: 'relative',
        padding: 6,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        borderWidth: 2,
        borderColor: '#0085C9',
        borderRadius: 10,
    },
    badgeLabel: {
        color: '#00A3E0',
        fontSize: 10,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: 'white',
        marginTop: 35,
        marginBottom: 10,
    },
    summaryGrid: {
        marginTop: -55,
        paddingHorizontal: 20,
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    cardMarginRight: {
        marginRight: 7,
    },
    cardMarginLeft: {
        marginLeft: 7,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    valueText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#333333',
    },
    labelText: {
        fontSize: 13,
        color: '#A0A0A0',
        fontWeight: '500',
    },
    sectionHeadingDark: {
        fontSize: 15,
        fontWeight: '800',
        color: '#333333',
        marginBottom: 16,
    },
    activityContainer: {
        marginTop: 25,
        paddingHorizontal: 20,
    },
    activityCardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    activityCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 14,
        paddingVertical: 18,
        paddingHorizontal: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F2F2F2',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 6,
        elevation: 2,
    },
    activityLabel: {
        fontSize: 13,
        color: '#666666',
        marginTop: 10,
        textAlign: 'center',
        fontWeight: '500',
    },
    approvalContainer: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    approvalCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        flexDirection: 'row',
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 0 },
        // shadowOpacity: 0.03,
        // shadowRadius: 8,
        elevation: 2,
    },
    approvalIconBox: {
        width: 60,
        height: 'auto',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    approvalContent: {
        flex: 1,
        marginLeft: 16,
    },
    approvalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    approvalTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333333',
    },
    approvalTime: {
        fontSize: 12,
        color: '#AAAAAA',
        fontWeight: '500',
    },
    approvalDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailText: {
        fontSize: 13,
        color: '#666666',
        marginLeft: 6,
        fontWeight: '600',
    },
    detailTextMargin: {
        marginRight: 16,
    },
    statusBadge: {
        backgroundColor: '#F3A754',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
    },
});