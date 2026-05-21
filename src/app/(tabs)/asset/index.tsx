import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native-ui-lib';

export default function AssetScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View flex center>
                <Text text50 color="#333333" style={{ fontWeight: 'bold' }}>
                    Daftar Asset
                </Text>
                <Text text80 color="#999999" marginT-10>
                    Ini adalah halaman Asset Anda
                </Text>
            </View>
        </SafeAreaView>
    );
}