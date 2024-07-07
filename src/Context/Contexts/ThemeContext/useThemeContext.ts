import { useColorScheme } from 'react-native';

import { DarkTheme, LightTheme } from '~/Styles/colors';

import { useThemeContextInner } from './ThemeContext';

export function useTheme() {
  const { userSelectedThemeState } = useThemeContextInner();

  const [userSelectedTheme] = userSelectedThemeState;

  const scheme = useColorScheme();

  let dark: boolean;

  if (userSelectedTheme == 'light') {
    dark = false;
  } else if (userSelectedTheme == 'dark') {
    dark = true;
  } else {
    if (scheme == 'light') {
      dark = false;
    } else {
      dark = true;
    }
  }

  const theme = dark ? DarkTheme : LightTheme;

  return { dark, colors: theme.colors };
}
