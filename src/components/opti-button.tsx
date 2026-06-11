import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacityProps, ViewStyle } from 'react-native';
import { Colors, TouchableOpacity } from 'react-native-ui-lib';
export interface OptiButtonProps extends TouchableOpacityProps {
    title: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}
export default function OptiButton
    ({ title, style, textStyle, ...props }: OptiButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, style]} activeOpacity={0.7} {...props}>
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
});