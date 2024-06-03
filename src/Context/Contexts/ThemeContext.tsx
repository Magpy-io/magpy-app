import React, { ReactNode, createContext, useContext, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';

import { DarkTheme, LightTheme, colorsType } from '~/Styles/colors';

type ThemeType = {
  dark: boolean;
  colors: colorsType;
};

export type ThemeContextType = {
  theme: ThemeType;
  colors: colorsType;
  dark: boolean;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type PropsType = {
  children: ReactNode;
};

const ThemeContextProvider: React.FC<PropsType> = props => {
  const scheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(scheme === 'dark' ? DarkTheme : LightTheme);
  StatusBar.setBarStyle(scheme === 'light' ? 'dark-content' : 'light-content');
  StatusBar.setBackgroundColor(theme.colors.BACKGROUND);

  const value = {
    theme: theme,
    colors: theme.colors,
    dark: theme.dark,
    setTheme: setTheme,
  };

  return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>;
};

function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('Theme Context not defined');
  }

  return context;
}

export { ThemeContextProvider, useTheme };
