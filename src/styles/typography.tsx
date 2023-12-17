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

export const typography = {
    sreenTitle: {
        ...textSize.extraLarge,
        fontWeight: '800',
    },
    formError: {
        color: colors.COLOR_ERROR_500,
        fontWeight: '800',
        fontSize: 13,
        letterSpacing: 0.5,
    },
};
