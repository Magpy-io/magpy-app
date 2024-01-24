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
  lightMediumText: TextStyle;
  largeText: TextStyle;
  sectionTitle: TextStyle;
  tabBarLabel: TextStyle;
  smallText: TextStyle;
} = {
  // TITLES & HEADERS
  screenTitle: {
    ...textSize.extraLarge2,
    color: appColors.TEXT,
    fontFamily: 'Inter-Regular',
  },
  sectionTitle: {
    ...textSize.extraLarge,
    color: appColors.TEXT,
    fontFamily: 'Inter-Medium',
  },

  // TEXTS in differents sizes
  smallText: {
    ...textSize.small,
    color: appColors.TEXT,
    fontFamily: 'Inter-Regular',
  },
  mediumText: {
    ...textSize.medium,
    color: appColors.TEXT,
    fontFamily: 'Inter-Regular',
  },
  lightMediumText: {
    ...textSize.medium,
    color: appColors.TEXT_LIGHT,
    fontFamily: 'Inter-Regular',
  },
  largeText: {
    ...textSize.large,
    color: appColors.TEXT,
    fontFamily: 'Inter-Medium',
  },

  // FORM specific typography
  formError: {
    color: colors.COLOR_ERROR_500,
    fontSize: 13,
    letterSpacing: 0.5,
    fontFamily: 'Inter-Medium',
  },
  formInfo: {
    color: appColors.TEXT_LIGHT,
    fontSize: 13,
    letterSpacing: 0.5,
    fontFamily: 'Inter-Medium',
  },

  // Bottom navigation tab bar text style
  tabBarLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
};
