import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, Text } from 'react-native-elements';

import { appColors } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

const PASSWORD_REQUIREMENTS =
  'Should have at least one uppercase, one number and one special character';

export default function PasswordRequirements() {
  return (
    <View style={styles.viewStyle}>
      <Icon name="info" size={16} color={appColors.TEXT_LIGHT} />
      <Text style={styles.textStyle}>{PASSWORD_REQUIREMENTS}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingLeft: spacing.spacing_xxs,
    ...typography.formInfo,
  },
  viewStyle: {
    paddingTop: spacing.spacing_xxs,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
