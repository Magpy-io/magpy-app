import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import { useMainContext } from '~/Context/Contexts/MainContext';
import { useServerClaimContext } from '~/Context/Contexts/ServerClaimContext';
import { useServerContext } from '~/Context/Contexts/ServerContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { PrimaryButton } from '../CommonComponents/Buttons';
import { ServerComponent } from './ServerComponent';

export default function ServerDetails() {
  const { server } = useServerClaimContext();
  const { isUsingLocalAccount } = useMainContext();
  const { serverNetwork, isServerReachable, findingServer, error } = useServerContext();
  const styles = useStyles(makeStyles);

  const hasServerLocal = isUsingLocalAccount && !!serverNetwork;
  const hasServerRemote = !isUsingLocalAccount && !!server;

  const hasServer = hasServerLocal || hasServerRemote;

  const ServerComponentLocal = () => (
    <ServerComponent
      hasServer={hasServer}
      ip={serverNetwork?.currentIp}
      port={serverNetwork?.currentPort}
      reachable={isServerReachable}
      findingServer={findingServer}
      error={error}
    />
  );

  const ServerComponentRemote = () => (
    <ServerComponent
      hasServer={hasServer}
      name={server?.name}
      ip={server?.ipPrivate}
      ipPublic={server?.ipPublic}
      port={server?.port}
      reachable={isServerReachable}
      findingServer={findingServer}
      error={error}
    />
  );

  return (
    <View style={styles.viewStyle}>
      <Text style={styles.titleStyle}>Details</Text>
      {isUsingLocalAccount ? <ServerComponentLocal /> : <ServerComponentRemote />}
      {hasServer && <PrimaryButton title={'Forget Server'} buttonStyle={{ marginTop: 5 }} />}
      {!hasServer && <PrimaryButton title={'Add a server'} buttonStyle={{ marginTop: 5 }} />}
      {error && <PrimaryButton title={'Reconnect To Server'} buttonStyle={{ marginTop: 5 }} />}
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    titleStyle: {
      ...typography(colors).largeTextBold,
      paddingVertical: spacing.spacing_m,
    },
    viewStyle: {
      marginHorizontal: spacing.spacing_m,
      marginBottom: spacing.spacing_s,
    },
  });
