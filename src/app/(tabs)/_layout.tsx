import { setupTheme } from "@/constant/theme";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-remix-icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "react-native-ui-lib";
setupTheme();
function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  // Warna tema selaras dengan HomeScreen
  const PRIMARY_COLOR = Colors.primary;
  const INACTIVE_COLOR = Colors.gray;
  const TAB_BAR_HEIGHT = 65; // Tinggi murni navbar (tanpa poni bawah)

  const icons = {
    index: "home-5-line",
    "asset/index": "box-3-line",
    "scan/index": "qr-scan-2-line",
    "approval/index": "task-line",
    "account/index": "user-3-line",
  } as const;

  const labels = {
    index: "Beranda",
    "asset/index": "Asset",
    "scan/index": "",
    "approval/index": "Persetujuan",
    "account/index": "Akun",
  };

  const scanRouteIndex = state.routes.findIndex(
    (r: any) => r.name === "scan/index",
  );
  const scanRoute = state.routes[scanRouteIndex];

  const onScanPress = () => {
    if (!scanRoute) return;
    const event = navigation.emit({
      type: "tabPress",
      target: scanRoute.key,
      canPreventDefault: true,
    });
    if (state.index !== scanRouteIndex && !event.defaultPrevented) {
      navigation.navigate(scanRoute.name);
    }
  };

  return (
    <View style={styles.absoluteWrapper} pointerEvents="box-none">
      {/* 1. Kotak Putih Navbar */}
      <View
        style={[
          styles.whiteBackground,
          {
            height: TAB_BAR_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const iconName = icons[route.name as keyof typeof icons];
          const label = labels[route.name as keyof typeof labels];

          if (!iconName) return null;

          // Placeholder untuk area bawah tombol melayang
          if (route.name === "scan/index") {
            return (
              <View key={index} style={styles.navItem} pointerEvents="none" />
            );
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented)
              navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              activeOpacity={0.7}
              onPress={onPress}
            >
              <Icon
                name={
                  isFocused
                    ? (iconName.replace("-line", "-fill") as any)
                    : (iconName as any)
                }
                size={24}
                color={isFocused ? PRIMARY_COLOR : INACTIVE_COLOR}
              />
              <Text
                style={[
                  styles.navText,
                  { color: isFocused ? PRIMARY_COLOR : INACTIVE_COLOR },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2. Tombol Scan Melayang */}
      <View
        style={[
          styles.floatingScanContainer,
          { bottom: insets.bottom + TAB_BAR_HEIGHT / 2 - 10 },
        ]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onScanPress}
          style={[
            styles.scanButton,
            { backgroundColor: PRIMARY_COLOR, shadowColor: PRIMARY_COLOR },
          ]}
        >
          <Icon name="qr-scan-2-line" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="asset/index" />
      <Tabs.Screen name="scan/index" />
      <Tabs.Screen name="approval/index" />
      <Tabs.Screen name="account/index" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  absoluteWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  whiteBackground: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F2F5", // Border lebih halus dan modern
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04, // Bayangan super tipis agar terasa melayang tapi tidak kotor
    shadowRadius: 12,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  navText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "600",
  },
  floatingScanContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 20, // Agak membulat (Squircle) lebih modern dari 15
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 4,
    borderColor: "#FFFFFF", // Menambahkan efek "lubang" pemisah dari background
  },
});
