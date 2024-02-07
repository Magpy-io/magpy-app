import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { appColors } from '~/styles/colors';
import { spacing } from '~/styles/spacing';
import { typography } from '~/styles/typography';

import { ArrowIcon } from '../CommonComponents/Icons';

type ServerComponentProps = {
  name: string;
  ip: string;
  port: string;
  onPress?: () => void;
};

export default function ServerComponent({ name, ip, port, onPress }: ServerComponentProps) {
  const IpAddress = `${ip}: ${port}`;
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.pressViewStyle}>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.ipAddress}>{IpAddress}</Text>
        </View>
        <ArrowIcon />
      </TouchableOpacity>
    );
  }
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
  pressViewStyle: {
    borderRadius: spacing.spacing_s,
    backgroundColor: appColors.BACKGROUND_LIGHT,
    padding: spacing.spacing_m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewStyle: {
    borderRadius: spacing.spacing_s,
    backgroundColor: appColors.BACKGROUND_LIGHT,
    padding: spacing.spacing_m,
  },
});
