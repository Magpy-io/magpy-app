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

export default function FormError({error}: {error: string | undefined}) {
    if (error) {
        return (
            <View style={styles.viewStyle}>
                <Icon name="cancel" size={16} color={colors.COLOR_ERROR_500} />
                <Text style={styles.textStyle}>{error}</Text>
            </View>
        );
    } else return <></>;
}

const styles = StyleSheet.create({
    textStyle: {
        paddingLeft: spacing.spacing_xxs,
        flex: 1,
        flexWrap: 'wrap',
        ...typography.formError,
    },
    viewStyle: {
        paddingTop: spacing.spacing_xxs,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
});
