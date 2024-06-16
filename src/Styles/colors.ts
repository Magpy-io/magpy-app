const colors = {
  TRANSPARENT: `rgba(0,0,0,0)`,
  WHITE: 'white',
  MAGPY_500: '#2CA7AF',
  MAGPY_600: '#1B8699',
  GREY_800: '#020D17',
  GREY_700: '#19232D',
  GREY_600: '#2A3541',
  GREY_500: '#404C58',
  GREY_400: '#9B9B9B',
  GREY_300: '#C8C8C8',
  GREY_200: '#E8E8E8',
  GREY_100: '#F5F5F6',
  SUCCESS_500: '#5aa97e',
  SUCCESS_400: '#acd3be',
  SUCCESS_300: '#d5e8de',
  SUCCESS_200: '#e9f3ee',
  SUCCESS_100: '#f3f8f6',
  ERROR_100: '#fbf3f2',
  ERROR_200: '#f8e9e6',
  ERROR_300: '#f2d5cf',
  ERROR_400: '#e7aca0',
  ERROR_500: '#d15b43',
  WARNING_100: '#FFF9E5',
  WARNING_200: '#FFF4CC',
  WARNING_300: '#FFEA99',
  WARNING_400: '#FFE066',
  WARNING_500: '#E5B700',
};

export type colorsType = {
  // Background
  BACKGROUND_LIGHT: string;
  BACKGROUND_INVERSE: string;
  BACKGROUND: string;
  MODAL_BACKGROUND: string;

  // Text
  TEXT: string;
  TEXT_LIGHT: string;
  TEXT_INVERSE: string;

  // App colors
  PRIMARY: string;
  SECONDARY: string;
  ACCENT: string;

  // Specific
  FORM_BORDER: string;
  SELECT_PHOTO: string;
  OUTLINE_BORDER: string;
  FILTER_ELEMENT: string;

  //Status
  SUCCESS: string;
  ERROR: string;
  WARNING: string;
  PENDING: string;

  //Misc
  UNDERLAY: string;
  TRANSPARENT: string;
};

export const LightTheme: { dark: boolean; colors: colorsType } = {
  dark: false,
  colors: {
    // Background
    BACKGROUND: colors.WHITE,
    BACKGROUND_INVERSE: colors.GREY_800,
    BACKGROUND_LIGHT: colors.GREY_100,
    MODAL_BACKGROUND: colors.WHITE,

    // Text
    TEXT: colors.GREY_800,
    TEXT_LIGHT: colors.GREY_500,
    TEXT_INVERSE: colors.WHITE,

    // App colors
    PRIMARY: colors.GREY_800,
    SECONDARY: colors.MAGPY_600,
    ACCENT: colors.MAGPY_500,

    // Specific
    FORM_BORDER: colors.GREY_500,
    OUTLINE_BORDER: colors.GREY_200,
    SELECT_PHOTO: colors.WHITE,
    FILTER_ELEMENT: colors.GREY_100,

    // Status
    SUCCESS: colors.SUCCESS_500,
    ERROR: colors.ERROR_500,
    WARNING: colors.WARNING_500,
    PENDING: colors.GREY_400,

    // Misc
    UNDERLAY: colors.GREY_100,
    TRANSPARENT: colors.TRANSPARENT,
  },
};

export const DarkTheme: { dark: boolean; colors: colorsType } = {
  dark: true,
  colors: {
    // Background
    BACKGROUND: colors.GREY_800,
    BACKGROUND_INVERSE: colors.GREY_300,
    BACKGROUND_LIGHT: colors.GREY_700,
    MODAL_BACKGROUND: colors.GREY_700,

    // Text
    TEXT: colors.GREY_300,
    TEXT_LIGHT: colors.GREY_400,
    TEXT_INVERSE: colors.GREY_800,

    // App colors
    PRIMARY: colors.MAGPY_500,
    SECONDARY: colors.MAGPY_500,
    ACCENT: colors.MAGPY_500,

    // Specific
    FORM_BORDER: colors.GREY_500,
    OUTLINE_BORDER: colors.GREY_700,
    SELECT_PHOTO: colors.WHITE,
    FILTER_ELEMENT: colors.GREY_600,

    // Status
    SUCCESS: colors.SUCCESS_500,
    ERROR: colors.ERROR_500,
    WARNING: colors.WARNING_400,
    PENDING: colors.GREY_400,

    // Misc
    TRANSPARENT: colors.TRANSPARENT,
    UNDERLAY: colors.GREY_700,
  },
};
