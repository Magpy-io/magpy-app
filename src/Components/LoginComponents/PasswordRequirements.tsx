import {ElementRef, useEffect, useRef, useState} from 'react';
import {
    Keyboard,
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {appColors, colors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';
import {typography, textSize} from '~/styles/typography';

const PASSWORD_REQUIREMENTS =
    'Should have at least one uppercase, one number and one special character';

export default function PasswordRequirements() {
    return (
        <View style={styles.viewStyle}>
            <Icon name="info" size={16} color={appColors.TEXT_LIGHT} />
            <Text style={styles.textStyle}>{PASSWORD_REQUIREMENTS}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    textStyle: {
        flex: 1,
        flexWrap: 'wrap',
        paddingLeft: spacing.spacing_xxs,
        ...typography.formInfo,
    },
    viewStyle: {
        paddingTop: spacing.spacing_xxs,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
});
