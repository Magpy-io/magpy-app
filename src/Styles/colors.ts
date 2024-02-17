const colors = {
  CYAN: '#2CA7AF',
  BLUE: '#1B8699',
  DARK: '#020D17',
  LESS_DARK: '#121A22',
  LIGHT_GREEN: '#454C53',
  WHITE: 'white',
  LIGHT_GREY: '#F5F5F6',
  SOFT_GREY: '#E8E8E8',
  TRANSPARENT: `rgba(0,0,0,0)`,
  COLOR_SUCCESS_500: '#5aa97e',
  COLOR_SUCCESS_400: '#acd3be',
  COLOR_SUCCESS_300: '#d5e8de',
  COLOR_SUCCESS_200: '#e9f3ee',
  COLOR_SUCCESS_100: '#f3f8f6',
  COLOR_ERROR_100: '#fbf3f2',
  COLOR_ERROR_200: '#f8e9e6',
  COLOR_ERROR_300: '#f2d5cf',
  COLOR_ERROR_400: '#e7aca0',
  COLOR_ERROR_500: '#d15b43',
  COLOR_WARNING_100: '#FFF9E5',
  COLOR_WARNING_200: '#FFF4CC',
  COLOR_WARNING_300: '#FFEA99',
  COLOR_WARNING_400: '#FFE066',
  COLOR_WARNING_500: '#E5B700',
  GREY: '#C8C8C8',
  DARKER_GREY: '#9B9B9B',
};

export type colorsType = {
  BACKGROUND_LIGHT: string;
  BACKGROUND: string;
  TEXT: string;
  TEXT_LIGHT: string;
  TEXT_INVERSE: string;
  PRIMARY: string;
  SECONDARY: string;
  ACCENT: string;
  FORM_BORDER: string;
  UNDERLAY: string;
  OUTLINE_BORDER: string;
  TRANSPARENT: string;
  SELECT: string;
  SUCCESS: string;
  ERROR: string;
  WARNING: string;
  MODAL_BACKGROUND: string;
};

export const LightTheme = {
  dark: false,
  colors: {
    BACKGROUND_LIGHT: colors.LIGHT_GREY,
    BACKGROUND: colors.WHITE,
    TEXT: colors.DARK,
    TEXT_LIGHT: colors.LIGHT_GREEN,
    TEXT_INVERSE: colors.WHITE,
    PRIMARY: colors.DARK,
    SECONDARY: colors.BLUE,
    ACCENT: colors.CYAN,
    FORM_BORDER: colors.LIGHT_GREEN,
    UNDERLAY: colors.LIGHT_GREY,
    OUTLINE_BORDER: colors.SOFT_GREY,
    TRANSPARENT: colors.TRANSPARENT,
    SELECT: colors.WHITE,
    SUCCESS: colors.COLOR_SUCCESS_500,
    ERROR: colors.COLOR_ERROR_500,
    WARNING: colors.COLOR_WARNING_500,
    MODAL_BACKGROUND: colors.WHITE,
  },
};

export const DarkTheme = {
  dark: true,
  colors: {
    BACKGROUND_LIGHT: colors.LESS_DARK,
    BACKGROUND: colors.DARK,
    TEXT: colors.GREY,
    TEXT_LIGHT: colors.DARKER_GREY,
    TEXT_INVERSE: colors.DARK,
    PRIMARY: colors.CYAN,
    SECONDARY: colors.CYAN,
    ACCENT: colors.BLUE,
    FORM_BORDER: colors.LIGHT_GREEN,
    UNDERLAY: colors.LESS_DARK,
    OUTLINE_BORDER: colors.LESS_DARK,
    TRANSPARENT: colors.TRANSPARENT,
    SELECT: colors.WHITE,
    SUCCESS: colors.COLOR_SUCCESS_500,
    ERROR: colors.COLOR_ERROR_500,
    WARNING: colors.COLOR_WARNING_400,
    MODAL_BACKGROUND: colors.LESS_DARK,
  },
};
