import { useMemo } from 'react';

import { useTheme } from '~/Context/Contexts/ThemeContext';
import { colorsType } from '~/Styles/colors';

export function useStyles<T>(makeStyles: (colors: colorsType, dark: boolean) => T) {
  const { colors, theme } = useTheme();
  const styles = useMemo(
    () => makeStyles(colors, theme.dark),
    [colors, makeStyles, theme.dark],
  );
  return styles;
}
