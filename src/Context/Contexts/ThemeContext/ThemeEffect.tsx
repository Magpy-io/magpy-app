import React, { ReactNode, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Appearance } from 'react-native';

import { DarkTheme, LightTheme } from '~/Styles/colors';

import { useTheme } from './useThemeContext';

type PropsType = {
  children: ReactNode;
};

export const ThemeEffect: React.FC<PropsType> = props => {
  const { dark } = useTheme();

  useEffect(() => {
    const theme = dark ? DarkTheme : LightTheme;
    StatusBar.setBarStyle(dark ? 'light-content' : 'dark-content');
    StatusBar.setBackgroundColor(theme.colors.BACKGROUND);
    Appearance.setColorScheme(dark ? 'dark' : 'light');
  }, [dark]);

  return props.children;
};
