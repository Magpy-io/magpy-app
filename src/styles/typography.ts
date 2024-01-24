import { TextStyle } from 'react-native/types';

import { appColors, colors } from './colors';

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

export const typography: {
  screenTitle: TextStyle;
  formError: TextStyle;
  formInfo: TextStyle;
  mediumText: TextStyle;
  largeText: TextStyle;
} = {
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
  mediumText: {
    ...textSize.medium,
    color: appColors.TEXT,
  },
  largeText: {
    ...textSize.large,
    color: appColors.TEXT,
  },
  formInfo: {
    color: appColors.TEXT_LIGHT,
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
};
