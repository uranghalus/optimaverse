import React, { useState } from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, ViewStyle } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { Colors, TouchableOpacity, View } from "react-native-ui-lib";

export interface OptiInputProps extends TextInputProps {
    label: string;
    required?: boolean;
    iconName?: string;
    isPassword?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
}

export default function OptiInput({
    label,
    required = false,
    placeholder,
    iconName,
    isPassword = false,
    containerStyle,
    inputStyle,
    onFocus, // Ekstrak onFocus dari props bawaan
    onBlur,  // Ekstrak onBlur dari props bawaan
    ...otherTextInputProps
}: OptiInputProps) {
    const [isSecure, setIsSecure] = useState(isPassword);
    // State baru untuk mendeteksi apakah input sedang aktif (ditekan)
    const [isFocused, setIsFocused] = useState(false);

    // Fungsi untuk menangani saat input ditekan
    const handleFocus = (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
        setIsFocused(true);
        if (onFocus) onFocus(e); // Tetap jalankan fungsi onFocus dari luar jika ada
    };

    // Fungsi untuk menangani saat pengguna keluar dari input
    const handleBlur = (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
        setIsFocused(false);
        if (onBlur) onBlur(e); // Tetap jalankan fungsi onBlur dari luar jika ada
    };

    return (
        <View style={[styles.inputContainer, containerStyle]}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>{label}</Text>
                {required && <Text style={styles.required}>*</Text>}
            </View>

            <View style={[
                styles.inputFieldContainer,
                // Mengubah warna border dan background secara dinamis berdasarkan state isFocused
                {
                    borderColor: isFocused ? Colors.primary : '#B0B0B0',
                    backgroundColor: isFocused ? Colors.white : '#F8F8F8',
                }
            ]}>
                {iconName && (
                    <View style={styles.leftIconContainer}>
                        <RemixIcon
                            name={iconName as any}
                            size={20}
                            // Mengubah warna ikon menjadi primary saat fokus
                            color={isFocused ? Colors.primary : Colors.gray}
                        />
                    </View>
                )}

                <TextInput
                    style={[styles.inputField, inputStyle]}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.placeholder}
                    secureTextEntry={isSecure}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={handleFocus} // Panggil handler focus
                    onBlur={handleBlur}   // Panggil handler blur
                    {...otherTextInputProps}
                />

                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsSecure(!isSecure)}
                        style={styles.rightIconContainer}
                    >
                        <RemixIcon
                            name={isSecure ? 'ri-eye-off-line' : 'ri-eye-line' as any}
                            size={20}
                            // Mengubah warna ikon mata menjadi primary saat fokus
                            color={isFocused ? Colors.primary : Colors.gray}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20
    },
    labelRow: {
        flexDirection: 'row',
        marginBottom: 8
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.black
    },
    required: {
        color: Colors.danger,
        marginLeft: 4,
        fontWeight: 'bold'
    },
    inputFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5, // Sedikit ditebalkan agar efek fokus lebih terlihat (opsional)
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 15,
        // borderColor dan backgroundColor dihapus dari sini karena sudah diatur secara dinamis di atas
    },
    leftIconContainer: {
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputField: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: Colors.black,
    },
    rightIconContainer: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});