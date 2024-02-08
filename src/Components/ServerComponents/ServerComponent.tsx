import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from 'react-native-elements';

import Logo from '~/Images/logoWhite.svg';
import { appColors, colors } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

type ServerComponentProps = {
  name: string;
  ip: string;
  port: string;
};

export default function ServerComponent({ name, ip, port }: ServerComponentProps) {
  const IpAddress = `${ip}: ${port}`;
  return (
    <View style={styles.viewStyle}>
      <View style={styles.iconStyle}>
        <Logo width={20} height={20} />
        <Badge
          status="success"
          containerStyle={{ position: 'absolute', top: -2, right: -2 }}
        />
      </View>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.ipAddress}>{IpAddress}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    backgroundColor: appColors.PRIMARY,
    padding: spacing.spacing_xs,
    borderRadius: borderRadius.avatar,
    alignContent: 'center',
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
    gap: spacing.spacing_m,
    alignItems: 'center',
  },
});
