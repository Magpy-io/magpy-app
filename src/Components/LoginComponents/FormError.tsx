import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, Text } from 'react-native-elements';

import { colors } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

export default function FormError({ error }: { error: string | undefined }) {
  if (error) {
    return (
      <View style={styles.viewStyle}>
        <Icon name="cancel" size={16} color={colors.COLOR_ERROR_500} />
        <Text style={styles.textStyle}>{error}</Text>
      </View>
    );
  } else {
    return <></>;
  }
}

const styles = StyleSheet.create({
  textStyle: {
    paddingLeft: spacing.spacing_xxs,
    flex: 1,
    flexWrap: 'wrap',
    ...typography.formError,
  },
  viewStyle: {
    paddingTop: spacing.spacing_xxs,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
