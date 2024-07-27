import { useMemo } from 'react';

import { useTheme } from '~/Context/Contexts/ThemeContext/';
import { colorsType } from '~/Styles/colors';

export function useStyles<T>(makeStyles: (colors: colorsType, dark: boolean) => T) {
  const { colors, dark } = useTheme();
  const styles = useMemo(() => makeStyles(colors, dark), [colors, makeStyles, dark]);
  return styles;
}
