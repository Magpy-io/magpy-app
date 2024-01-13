import {StyleProp, TextStyle} from 'react-native';
import {appColors, colors} from './colors';

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
        fontSize: 20,
    },
    extraLarge2: {
        fontSize: 32,
    },
};

export const typography: any = {
    screenTitle: {
        ...textSize.extraLarge2,
        fontWeight: 'normal',
        color: appColors.TEXT,
    },
    formError: {
        color: colors.COLOR_ERROR_500,
        fontWeight: 'bold',
        fontSize: 13,
        letterSpacing: 0.5,
    },
    formInfo: {
        color: appColors.TEXT_LIGHT,
        fontWeight: 'bold',
        fontSize: 13,
        letterSpacing: 0.5,
    },
};
