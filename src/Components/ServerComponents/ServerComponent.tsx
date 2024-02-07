import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { appColors, colors } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { InfoIcon } from '../CommonComponents/Icons';

type ServerComponentProps = {
  name: string;
  ip: string;
  port: string;
};

export default function ServerComponent({ name, ip, port }: ServerComponentProps) {
  const IpAddress = `${ip}: ${port}`;
  return (
    <View style={styles.viewStyle}>
      <InfoIcon iconStyle={styles.iconStyle} />
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.ipAddress}>{IpAddress}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    backgroundColor: appColors.ACCENT,
    padding: spacing.spacing_xs,
    borderRadius: borderRadius.avatar,
    color: appColors.TEXT_INVERSE,
  },
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
    flexDirection: 'row',
    gap: spacing.spacing_s,
    alignItems: 'flex-start',
  },
});
