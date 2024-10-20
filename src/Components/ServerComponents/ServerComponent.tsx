import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from 'react-native-elements';

import { ConnectingToServerError, useServerContext } from '~/Context/Contexts/ServerContext';
import { useServerInvalidationContext } from '~/Context/Contexts/ServerInvalidationContext';
import { useStyles } from '~/Hooks/useStyles';
import Logo from '~/Images/logoWhite.svg';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { useServerStatusColor } from './hooks/useServerStatusColor';
import { useUserHasServer } from './hooks/useUserHasServer';

type ServerComponentProps = {
  name?: string;
  ip?: string;
  ipPublic?: string;
  port?: string;
  error: ConnectingToServerError;
};

export function ServerComponent({ name, ip, port, error }: ServerComponentProps) {
  const IpAddress = `${ip}:${port}`;
  const styles = useStyles(makeStyles);
  const { findingServer } = useServerContext();
  const hasServer = useUserHasServer();
  const serverStateColor = useServerStatusColor();

  const { isRefreshing } = useServerInvalidationContext();

  const errorMessage: string =
    error == 'SERVER_AUTH_FAILED'
      ? 'Authentification failed'
      : error == 'SERVER_NOT_REACHABLE'
        ? 'Server unreachable'
        : '';

  const NoServerBadge = () => {
    return <Text style={styles.ipAddress}>No associated server</Text>;
  };

  const ServerBadge = () => {
    return (
      <View>
        {name && <Text style={styles.name}>{name}</Text>}
        {<Text style={styles.ipAddress}>{IpAddress}</Text>}
        {findingServer && (
          <Text style={styles.textInfo}>{'Trying to locate your server...'}</Text>
        )}
        {isRefreshing && <Text style={styles.textInfo}>{'Fetching server photos...'}</Text>}
        {!findingServer && error && <Text style={styles.unreachable}>{errorMessage}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.viewStyle}>
      <View style={styles.iconStyle}>
        <Logo width={20} height={20} />
        <Badge
          badgeStyle={{ backgroundColor: serverStateColor }}
          containerStyle={{ position: 'absolute', top: -2, right: -2 }}
        />
      </View>
      {hasServer ? <ServerBadge /> : <NoServerBadge />}
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
    unreachable: {
      ...typography(colors).mediumTextBold,
      color: colors.WARNING,
    },
    textInfo: {
      ...typography(colors).mediumTextBold,
      color: colors.PENDING,
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
