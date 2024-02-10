import { useMemo } from 'react';

import { useTheme } from '~/Context/ThemeContext';
import { colorsType } from '~/Styles/colors';

export function useStyles<T>(makeStyles: (colors: colorsType) => T) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors, makeStyles]);
  return styles;
}
