import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { appColors, colors } from '~/styles/colors';
import { spacing } from '~/styles/spacing';
import { typography } from '~/styles/typography';

type ServerComponentProps = {
  name: string;
  ip: string;
  port: string;
};

export default function ServerComponent({ name, ip, port }: ServerComponentProps) {
  const IpAddress = `${ip}: ${port}`;
  return (
    <View style={styles.viewStyle}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.ipAddress}>{IpAddress}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ipAddress: {
    ...typography.lightMediumText,
  },
  name: {
    ...typography.mediumTextBold,
    paddingBottom: 4,
  },
  viewStyle: {
    borderRadius: spacing.spacing_s,
    borderWidth: 1,
    backgroundColor: colors.TRANSPARENT,
    borderColor: appColors.OUTLINE_BORDER,
    padding: spacing.spacing_m,
  },
});
