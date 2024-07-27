import { TextStyle } from 'react-native/types';

import { colorsType } from './colors';

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

type typographyType = (colors: colorsType) => {
  screenTitle: TextStyle;
  sectionTitle: TextStyle;

  smallText: TextStyle;
  mediumText: TextStyle;
  largeText: TextStyle;
  extraLargeText: TextStyle;

  smallTextBold: TextStyle;
  mediumTextBold: TextStyle;
  largeTextBold: TextStyle;
  extraLargeTextBold: TextStyle;

  lightSmallText: TextStyle;
  lightMediumText: TextStyle;
  lightLargeText: TextStyle;

  formInfo: TextStyle;
  formError: TextStyle;
  tabBarLabel: TextStyle;
};

export const typography: typographyType = (colors: colorsType) => {
  return {
    // TITLES & HEADERS
    screenTitle: {
      ...textSize.extraLarge2,
      color: colors.TEXT,
      fontFamily: 'Inter-Regular',
    },
    sectionTitle: {
      ...textSize.extraLarge,
      color: colors.TEXT,
      fontFamily: 'Inter-Medium',
    },

    // TEXTS in differents sizes
    smallText: {
      ...textSize.small,
      color: colors.TEXT,
      fontFamily: 'Inter-Regular',
    },
    mediumText: {
      ...textSize.medium,
      color: colors.TEXT,
      fontFamily: 'Inter-Regular',
    },
    largeText: {
      ...textSize.large,
      color: colors.TEXT,
      fontFamily: 'Inter-Regular',
    },
    extraLargeText: {
      ...textSize.extraLarge,
      color: colors.TEXT,
      fontFamily: 'Inter-Regular',
    },

    // TEXTS in differents sizes but BOLD
    smallTextBold: {
      ...textSize.small,
      color: colors.TEXT,
      fontFamily: 'Inter-Medium',
    },
    mediumTextBold: {
      ...textSize.medium,
      color: colors.TEXT,
      fontFamily: 'Inter-Medium',
    },
    largeTextBold: {
      ...textSize.large,
      color: colors.TEXT,
      fontFamily: 'Inter-Medium',
    },
    extraLargeTextBold: {
      ...textSize.extraLarge,
      color: colors.TEXT,
      fontFamily: 'Inter-Medium',
    },

    // TEXTS in differents sizes in Lighter color (grey)
    lightSmallText: {
      ...textSize.small,
      color: colors.TEXT_LIGHT,
      fontFamily: 'Inter-Regular',
    },
    lightMediumText: {
      ...textSize.medium,
      color: colors.TEXT_LIGHT,
      fontFamily: 'Inter-Regular',
    },
    lightLargeText: {
      ...textSize.large,
      color: colors.TEXT_LIGHT,
      fontFamily: 'Inter-Medium',
    },

    // FORM specific typography
    formError: {
      color: colors.ERROR,
      fontSize: 13,
      letterSpacing: 0.5,
      fontFamily: 'Inter-Medium',
    },
    formInfo: {
      color: colors.TEXT_LIGHT,
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
};
