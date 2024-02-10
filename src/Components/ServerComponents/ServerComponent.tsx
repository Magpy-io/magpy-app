import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from 'react-native-elements';

import { useStyles } from '~/Hooks/useStyles';
import Logo from '~/Images/logoWhite.svg';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

type ServerComponentProps = {
  name: string;
  ip: string;
  port: string;
};

export default function ServerComponent({ name, ip, port }: ServerComponentProps) {
  const IpAddress = `${ip}: ${port}`;
  const styles = useStyles(makeStyles);

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

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    iconStyle: {
      backgroundColor: colors.PRIMARY,
      padding: spacing.spacing_xs,
      borderRadius: borderRadius.avatar,
      alignContent: 'center',
    },
    ipAddress: {
      ...typography(colors).lightMediumText,
    },
    name: {
      ...typography(colors).mediumTextBold,
      paddingBottom: 4,
    },
    viewStyle: {
      borderRadius: spacing.spacing_s,
      borderWidth: 1,
      backgroundColor: colors.TRANSPARENT,
      borderColor: colors.OUTLINE_BORDER,
      padding: spacing.spacing_m,
      flexDirection: 'row',
      gap: spacing.spacing_m,
      alignItems: 'center',
    },
  });
