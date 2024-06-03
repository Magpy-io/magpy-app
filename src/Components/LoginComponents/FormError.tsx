import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, Text } from 'react-native-elements';

import { useTheme } from '~/Context/Contexts/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

export default function FormError({ error }: { error: string | undefined }) {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  if (error) {
    return (
      <View style={styles.viewStyle}>
        <Icon name="cancel" size={16} color={colors.ERROR} />
        <Text style={styles.textStyle}>{error}</Text>
      </View>
    );
  } else {
    return <></>;
  }
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    textStyle: {
      paddingLeft: spacing.spacing_xxs,
      flex: 1,
      flexWrap: 'wrap',
      ...typography(colors).formError,
    },
    viewStyle: {
      paddingTop: spacing.spacing_xxs,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  });
