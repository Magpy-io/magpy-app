import { StyleSheet } from 'react-native';

import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

export const makeFilterStyles = (colors: colorsType) =>
  StyleSheet.create({
    elementListView: {
      gap: spacing.spacing_xs,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    section: {
      gap: spacing.spacing_m,
    },
    title: {
      ...typography(colors).largeTextBold,
    },
  });
