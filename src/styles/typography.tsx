import {StyleProp, TextStyle} from 'react-native';
import {colors} from './colors';

export const textSize = {
    small: {
        fontSize: 12,
    },
    medium: {
        fontSize: 14,
    },
    large: {
        fontSize: 16,
    },
    extraLarge: {
        fontSize: 32,
    },
};

export const typography: any = {
    screenTitle: {
        ...textSize.extraLarge,
        fontWeight: '800',
    },
    formError: {
        color: colors.COLOR_ERROR_500,
        fontWeight: '800',
        fontSize: 13,
        letterSpacing: 0.5,
    },
    formInfo: {
        color: colors.COLOR_SECONDARY_400,
        fontWeight: '800',
        fontSize: 13,
        letterSpacing: 0.5,
    },
};
