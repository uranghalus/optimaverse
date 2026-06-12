import ScannerMask from '@/components/scanner-mask';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import RemixIcon from 'react-native-remix-icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from 'react-native-ui-lib';

Colors.loadColors({
    primary: '#0ea5e9',
    statusTersediaBg: '#ecfdf5',
    statusTersediaText: '#10b981',
});

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCAN_AREA_WIDTH = SCREEN_WIDTH * 0.88;
const SCAN_AREA_HEIGHT = 120;

const SCAN_TOP = 150;

interface Asset {
    id: string;
    name: string;
    location: string;
    assetId: string;
    status: string;
}

export default function ScanScreen() {
    const insets = useSafeAreaInsets();

    const [permission, requestPermission] = useCameraPermissions();
    const [isFlashOn, setIsFlashOn] = useState(false);
    const [scannedData, setScannedData] = useState<Asset | null>(null);

    const scanLineAnim = useRef(new Animated.Value(0)).current;

    const dummyAsset: Asset = {
        id: '1',
        name: 'ThinkPad T14 Gen 3',
        location: 'Ruang Server Lt. 2',
        assetId: 'AST-IT-2026-001',
        status: 'Tersedia',
    };

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, {
                    toValue: 1,
                    duration: 1800,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(scanLineAnim, {
                    toValue: 0,
                    duration: 1800,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const LINE_PADDING = 12;

    const translateY = scanLineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [
            LINE_PADDING,
            SCAN_AREA_HEIGHT - LINE_PADDING,
        ],
    });

    const handleBarCodeScanned = ({ data }: any) => {
        console.log(data);

        if (scannedData) return;

        setScannedData(dummyAsset);
    };

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.permissionText}>
                    Akses kamera diperlukan untuk memindai barcode.
                </Text>

                <TouchableOpacity
                    style={styles.permissionBtn}
                    onPress={requestPermission}
                >
                    <Text style={styles.permissionBtnText}>Beri Akses</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Tabs.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                enableTorch={isFlashOn}
                barcodeScannerSettings={{
                    barcodeTypes: [
                        'qr',
                        'ean13',
                        'ean8',
                        'code128',
                        'code39',
                    ],
                }}
                onBarcodeScanned={
                    scannedData ? undefined : handleBarCodeScanned
                }
            />

            {/* Overlay */}
            <View style={StyleSheet.absoluteFill}>
                <ScannerMask
                    scannerWidth={SCAN_AREA_WIDTH}
                    scannerHeight={SCAN_AREA_HEIGHT}
                    scannerTop={SCAN_TOP}
                    radius={24}

                />

                {/* HEADER */}
                <View
                    style={[
                        styles.headerContainer,
                        {
                            marginTop: insets.top,
                        },
                    ]}
                >
                    <Text style={styles.headerTitle}>
                        Scan Barcode
                    </Text>

                    <TouchableOpacity
                        style={styles.flashButton}
                        onPress={() => setIsFlashOn(!isFlashOn)}
                    >
                        <RemixIcon
                            name={isFlashOn ? 'flashlight-fill' : 'flashlight-line'}
                            size={24}
                            color="#0ea5e9"
                        />
                    </TouchableOpacity>
                </View>

                {/* SCANNER FRAME */}
                <View
                    style={{
                        position: 'absolute',
                        top: SCAN_TOP,
                        alignSelf: 'center',
                        width: SCAN_AREA_WIDTH,
                        height: SCAN_AREA_HEIGHT,
                    }}
                >
                    <Animated.View
                        style={[
                            styles.scanLineContainer,
                            {
                                transform: [{ translateY }],
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={[
                                'transparent',
                                '#0ea5e9',
                                '#38bdf8',
                                '#0ea5e9',
                                'transparent',
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.scanLine}
                        />
                    </Animated.View>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                </View>

                {/* TEXT */}
                <View style={styles.instructionContainer}>
                    <Text style={styles.instructionText}>
                        Posisikan barcode tepat di tengah area
                        pemindai, lalu arahkan kamera hingga
                        barcode terlihat jelas.
                    </Text>

                    {scannedData && (
                        <TouchableOpacity
                            style={styles.rescanButton}
                            onPress={() => setScannedData(null)}
                        >
                            <RemixIcon
                                name="refresh-line"
                                size={18}
                                color="#FFF"
                            />

                            <Text style={styles.rescanButtonText}>
                                Scan Ulang
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Result Card */}
            {scannedData && (
                <View
                    style={[
                        styles.resultContainer,
                        {
                            bottom: insets.bottom + 100,
                        },
                    ]}
                >
                    <View style={styles.cardContainer}>
                        <View style={styles.imagePlaceholder} />

                        <View style={styles.assetDetails}>
                            <Text style={styles.assetName}>
                                {scannedData.name}
                            </Text>

                            <View style={styles.locationRow}>
                                <RemixIcon
                                    name="map-pin-2-line"
                                    size={14}
                                    color="#6b7280"
                                />

                                <Text style={styles.locationText}>
                                    {scannedData.location}
                                </Text>
                            </View>

                            <View style={styles.bottomDetailRow}>
                                <Text style={styles.assetIdText}>
                                    {scannedData.assetId}
                                </Text>

                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>
                                        {scannedData.status}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },

    permissionText: {
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },

    permissionBtn: {
        backgroundColor: '#0ea5e9',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },

    permissionBtnText: {
        color: '#fff',
        fontWeight: '700',
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },

    headerContainer: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    instructionContainer: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        top: SCAN_TOP + SCAN_AREA_HEIGHT + 35,
    },

    rescanButton: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,

        backgroundColor: 'rgba(14,165,233,0.15)',

        borderWidth: 1,
        borderColor: '#0ea5e9',

        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 999,
    },

    rescanButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },

    flashButton: {
        position: 'absolute',
        right: 20,
    },

    scannerContainer: {
        marginTop: 50,
        alignItems: 'center',
    },

    scanFrame: {
        width: SCAN_AREA_WIDTH,
        height: SCAN_AREA_HEIGHT,
        position: 'relative',
    },

    instructionText: {
        marginTop: 24,
        color: '#fff',
        textAlign: 'center',
        width: SCAN_AREA_WIDTH,
        fontSize: 15,
        lineHeight: 22,
    },
    scanLineContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    scanLine: {
        position: 'absolute',

        left: 12,
        right: 12,

        height: 3,

        borderRadius: 999,

        backgroundColor: '#0ea5e9',

        shadowColor: '#0ea5e9',
        shadowOpacity: 1,
        shadowRadius: 10,

        elevation: 12,
    },
    corner: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderColor: '#0ea5e9',
        borderWidth: 3,

        // shadowColor: '#0ea5e9',
        // shadowOpacity: 0.8,
        // shadowRadius: 6,
        // elevation: 6,
    },

    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 16,
    },

    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 16,
    },

    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 16,
    },

    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 16,
    },
    resultContainer: {
        position: 'absolute',
        left: 16,
        right: 16,
        zIndex: 10,
    },

    cardContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        elevation: 8,
    },

    imagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#0ea5e9',
    },

    assetDetails: {
        flex: 1,
        marginLeft: 12,
    },

    assetName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
    },

    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },

    locationText: {
        marginLeft: 4,
        color: '#6b7280',
        fontSize: 13,
    },

    bottomDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },

    assetIdText: {
        fontSize: 13,
        color: '#6b7280',
    },

    statusBadge: {
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    statusText: {
        color: '#10b981',
        fontSize: 12,
        fontWeight: '600',
    },
});