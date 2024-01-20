import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Icon } from 'react-native-elements';

import { appColors } from '~/styles/colors';
import { spacing } from '~/styles/spacing';
import { textSize } from '~/styles/typography';

import { ArrowIcon } from '../CommonComponents/Icons';

type ServerComponentProps = {
  onSelectServer: () => void;
  name: string;
  ip: string;
  port: string;
};

export default function ServerComponent({
  onSelectServer,
  name,
  ip,
  port,
}: ServerComponentProps) {
  const IpAddress = `${ip}: ${port}`;
  return (
    <TouchableOpacity onPress={() => onSelectServer()} style={styles.viewStyle}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.ipAddress}>{IpAddress}</Text>
      </View>
      <ArrowIcon />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ipAddress: {
    ...textSize.medium,
    color: appColors.TEXT_LIGHT,
  },
  name: {
    ...textSize.large,
    color: appColors.TEXT,
  },
  viewStyle: {
    marginHorizontal: spacing.spacing_l,
    borderRadius: spacing.spacing_xs,
    backgroundColor: appColors.BACKGROUND_LIGHT,
    padding: spacing.spacing_m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
