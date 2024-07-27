import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { ArrowIcon } from '../CommonComponents/Icons';

type ServerComponentProps = {
  name: string;
  ip: string;
  port: string;
  onPress?: () => void;
};

export default function ServerComponent({ name, ip, port, onPress }: ServerComponentProps) {
  const IpAddress = `${ip}: ${port}`;
  const styles = useStyles(makeStyles);

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

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    ipAddress: {
      ...typography(colors).lightMediumText,
    },
    name: {
      ...typography(colors).mediumTextBold,
      paddingBottom: 4,
    },
    pressViewStyle: {
      borderRadius: spacing.spacing_s,
      borderWidth: 1,
      borderColor: colors.OUTLINE_BORDER,
      backgroundColor: colors.TRANSPARENT,
      padding: spacing.spacing_m,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
