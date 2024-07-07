import React, { ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { DarkTheme, LightTheme } from '~/Styles/colors';

type PropsType = {
  children: ReactNode;
};

export const ThemeEffect: React.FC<PropsType> = props => {
  const scheme = useColorScheme();

  useEffect(() => {
    const theme = scheme === 'dark' ? DarkTheme : LightTheme;
    //StatusBar.setBarStyle(scheme === 'light' ? 'dark-content' : 'light-content');
    //StatusBar.setBackgroundColor(theme.colors.BACKGROUND);
  }, [scheme]);

  return props.children;
};
