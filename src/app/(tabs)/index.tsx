import AnimatedCounter from "@/components/animated-counter";
import TouchableScale from "@/components/touchable-scale";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-remix-icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionSheet, Badge, Colors, Text } from "react-native-ui-lib";

// Pastikan path ini sesuai dengan lokasi inisialisasi Better Auth Client Anda
import { useAuth } from "@/context/auth-context";
import { authClient } from "@/lib/auth-client";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  // 1. PANGGIL HOOKS BETTER AUTH DI LEVEL TERATAS
  const { user } = useAuth()
  const { data: organizations, isPending: isOrgsLoading } = authClient.useListOrganizations();
  const { data: activeOrg, isPending: isActiveOrgLoading } = authClient.useActiveOrganization();



  // 2. STATE UI
  const [showOrgPicker, setShowOrgPicker] = useState(false);
  const [isSettingActive, setIsSettingActive] = useState(false);

  // 3. LOGIKA PAKSA PEMILIHAN UNTUK OWNER
  useEffect(() => {
    if (!isOrgsLoading && !isActiveOrgLoading && organizations && user) {
      const isSystemOwner = user.role === "owner" || user.role === "admin";

      // Jika belum ada yang aktif, dan dia Owner dengan >1 org, paksa buka menu
      if (!activeOrg && isSystemOwner && organizations.length > 1) {
        setShowOrgPicker(true);
      }
    }
  }, [isOrgsLoading, isActiveOrgLoading, organizations, activeOrg, user]);

  // 4. FUNGSI SET ACTIVE (Vanilla Method)
  const handleSelectOrganization = async (orgId: string) => {
    setShowOrgPicker(false);
    setIsSettingActive(true);

    try {
      const { error } = await authClient.organization.setActive({
        organizationId: orgId
      });

      if (error) {
        Alert.alert("Gagal", error.message || "Gagal mengubah organisasi");
      }
      // Tidak perlu set state manual, useActiveOrganization() akan otomatis memicu re-render
    } catch (err) {
      Alert.alert("Error", "Koneksi terputus dengan server");
    } finally {
      setIsSettingActive(false);
    }
  };

  // 5. PERSIAPAN DATA RENDER
  const actionSheetOptions = organizations?.map((org) => ({
    label: org.name,
    onPress: () => handleSelectOrganization(org.id),
  })) || [];

  actionSheetOptions.push({
    label: "Batal",
    onPress: async () => setShowOrgPicker(false),
  });

  const isLoading = isOrgsLoading || isActiveOrgLoading || isSettingActive;
  const canSelectOrg = user?.role === "owner" || user?.role === "admin";

  const displayOrgName = activeOrg?.name
    || (organizations && organizations.length > 0 ? organizations[0].name : "Pilih Organisasi...");

  // 6. PERHITUNGAN ANIMASI & LAYOUT
  const TOP_BAR_HEIGHT = Platform.OS === "ios" ? insets.top + 75 : insets.top + 80;
  const SCROLL_DISTANCE = 90;

  const whiteOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE / 1.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const darkOpacity = scrollY.interpolate({
    inputRange: [SCROLL_DISTANCE / 2, SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* LAYER 1: FIXED TOP BAR */}
      <View
        style={[
          styles.fixedTopBar,
          { height: TOP_BAR_HEIGHT, paddingTop: insets.top + 10 },
        ]}
      >
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.greetingText}>Halo, {user?.name || "Username"}</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => canSelectOrg && organizations && organizations.length > 0 && setShowOrgPicker(true)}
              style={styles.dropdownTrigger}
              disabled={!canSelectOrg || isLoading || !organizations || organizations.length === 0}
            >
              <Text style={styles.nameText}>
                {isLoading ? "Memuat..." : displayOrgName}
              </Text>

              {canSelectOrg && organizations && organizations.length > 0 && (
                <Icon name="arrow-down-s-line" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <TouchableScale style={styles.bellContainer}>
            <Icon name="notification-3-line" size={26} color="white" />
            <View style={styles.badge}>
              <Badge
                size={14}
                label="5"
                backgroundColor="#EF4444"
                labelStyle={styles.badgeLabel}
              />
            </View>
          </TouchableScale>
        </View>
      </View>

      {/* LAYER 2: KONTEN YANG BISA DI-SCROLL */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: TOP_BAR_HEIGHT,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.blueExtension} />

        <View style={styles.overlapContainer}>
          <View style={styles.titleWrapper}>
            <Animated.Text
              style={[
                styles.sectionTitle,
                { color: "#1E293B", opacity: darkOpacity },
              ]}
            >
              Ringkasan Asset
            </Animated.Text>

            <Animated.Text
              style={[
                styles.sectionTitle,
                {
                  color: "white",
                  opacity: whiteOpacity,
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
              ]}
            >
              Ringkasan Asset
            </Animated.Text>
          </View>

          {/* Ringkasan Asset Cards */}
          <View style={styles.summaryGrid}>
            <View style={styles.gridRow}>
              <TouchableScale style={[styles.summaryCard, styles.cardMarginRight]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: Colors.primary }]}>
                    <Icon name="box-3-line" size={22} color="white" />
                  </View>
                  <AnimatedCounter targetValue={50025} style={styles.valueText} />
                </View>
                <Text style={styles.labelText}>Total Aset Aktif</Text>
              </TouchableScale>

              <TouchableScale style={[styles.summaryCard, styles.cardMarginLeft]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: "#10B981" }]}>
                    <Icon name="file-transfer-line" size={22} color="white" />
                  </View>
                  <AnimatedCounter targetValue={12} style={styles.valueText} />
                </View>
                <Text style={styles.labelText}>Butuh Approval</Text>
              </TouchableScale>
            </View>

            <View style={styles.gridRow}>
              <TouchableScale style={[styles.summaryCard, styles.cardMarginRight]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: "#8B5CF6" }]}>
                    <Icon name="hand-heart-line" size={22} color="white" />
                  </View>
                  <AnimatedCounter targetValue={340} style={styles.valueText} />
                </View>
                <Text style={styles.labelText}>Aset Dipinjam</Text>
              </TouchableScale>

              <TouchableScale style={[styles.summaryCard, styles.cardMarginLeft]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: "#F59E0B" }]}>
                    <Icon name="building-4-line" size={22} color="white" />
                  </View>
                  <AnimatedCounter targetValue={8} style={styles.valueText} />
                </View>
                <Text style={styles.labelText}>Stok Menipis</Text>
              </TouchableScale>
            </View>
          </View>
        </View>

        {/* Aktivitas Aset Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeadingDark}>Aktivitas Aset</Text>
          <View style={styles.activityCardsRow}>
            <TouchableScale style={[styles.activityCard, styles.cardMarginRight]}>
              <Icon name="drag-move-2-line" size={26} color={Colors.primary} />
              <Text style={styles.activityLabel}>Mutasi Asset</Text>
            </TouchableScale>

            <TouchableScale style={[styles.activityCard, styles.cardMarginRight, styles.cardMarginLeft]}>
              <Icon name="hand-heart-line" size={26} color="#8B5CF6" />
              <Text style={styles.activityLabel}>Pinjam Asset</Text>
            </TouchableScale>

            <TouchableScale style={[styles.activityCard, styles.cardMarginLeft]}>
              <Icon name="delete-bin-4-line" size={26} color="#EF4444" />
              <Text style={styles.activityLabel}>Disposal</Text>
            </TouchableScale>
          </View>
        </View>

        {/* Perlu Persetujuan Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeadingDark}>Perlu Persetujuan</Text>

          {[1, 2, 3].map((item) => (
            <TouchableScale key={item} style={styles.approvalCard}>
              <View style={[styles.approvalIconBox, { backgroundColor: "#EEF2FF" }]}>
                <Icon name="hand-heart-line" size={26} color="#6366F1" />
              </View>
              <View style={styles.approvalContent}>
                <View style={styles.approvalHeader}>
                  <Text style={styles.approvalTitle}>Peminjaman Asset</Text>
                  <Text style={styles.approvalTime}>Baru Saja</Text>
                </View>
                <View style={styles.approvalDetails}>
                  <Icon name="building-4-line" size={14} color="#94A3B8" />
                  <Text style={[styles.detailText, styles.detailTextMargin]}>
                    Marketing
                  </Text>
                  <Icon name="box-3-line" size={14} color="#94A3B8" />
                  <Text style={styles.detailText}>Speaker</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Menunggu Persetujuan</Text>
                </View>
              </View>
            </TouchableScale>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Komponen Action Sheet Terintegrasi Dinamis */}
      <ActionSheet
        visible={showOrgPicker}
        title="Pilih Organisasi"
        message="Silakan pilih ruang lingkup organisasi OptiAssets"
        cancelButtonIndex={actionSheetOptions.length - 1}
        onDismiss={() => setShowOrgPicker(false)}
        options={actionSheetOptions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  fixedTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.primary,
    zIndex: 10,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 24,
  },
  blueExtension: {
    backgroundColor: Colors.primary,
    height: 140,
    marginTop: -50,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 4,
    fontWeight: "500",
  },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: -2,
  },
  nameText: {
    fontSize: 22,
    color: "white",
    fontWeight: "800",
  },
  bellContainer: {
    position: "relative",
    padding: 6,
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 10,
  },
  badgeLabel: {
    color: "white",
    fontSize: 9,
    fontWeight: "800",
  },
  overlapContainer: {
    marginTop: -85,
    paddingHorizontal: 20,
  },
  titleWrapper: {
    position: "relative",
    marginBottom: 16,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  sectionHeadingDark: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 12,
  },
  summaryGrid: {
    marginTop: 0,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#8C86B7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 15 / 100,
    shadowRadius: 0.5,
    elevation: 10,
  },
  cardMarginRight: {
    marginRight: 6,
  },
  cardMarginLeft: {
    marginLeft: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  iconBox: {
    height: 40,
    width: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  valueText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  labelText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  activityCardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  activityLabel: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: Colors.gray,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  approvalCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 11,
    flexDirection: "row",
    marginBottom: 12,
    borderColor: "#f0f0f0",
    borderWidth: 1.5,
  },
  approvalIconBox: {
    width: 56,
    height: "auto",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  approvalContent: {
    flex: 1,
    marginLeft: 16,
  },
  approvalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  approvalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  approvalTime: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },
  approvalDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 4,
    fontWeight: "500",
  },
  detailTextMargin: {
    marginRight: 16,
  },
  statusBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#D97706",
    fontSize: 11,
    fontWeight: "700",
  },
});