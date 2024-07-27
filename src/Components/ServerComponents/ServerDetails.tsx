import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import {
  useLocalAccountContext,
  useLocalAccountContextFunctions,
} from '~/Context/Contexts/LocalAccountContext';
import { useMainContext } from '~/Context/Contexts/MainContext';
import {
  useServerClaimContext,
  useServerClaimFunctions,
} from '~/Context/Contexts/ServerClaimContext';
import {
  useFindServerFunctions,
  useServerContext,
  useServerContextFunctions,
} from '~/Context/Contexts/ServerContext';
import { useStyles } from '~/Hooks/useStyles';
import { useMainStackNavigation } from '~/Navigation/Navigators/MainStackNavigator';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { PrimaryButton } from '../CommonComponents/Buttons';
import { ServerComponent } from './ServerComponent';
import { useUserHasServer } from './hooks/useUserHasServer';

export default function ServerDetails() {
  const { server } = useServerClaimContext();
  const { serverName } = useLocalAccountContext();
  const { forgetServerLocal } = useLocalAccountContextFunctions();
  const { isUsingLocalAccount } = useMainContext();
  const { serverNetwork, error } = useServerContext();
  const { forgetServer } = useServerContextFunctions();
  const { forgetServer: forgetServerRemote } = useServerClaimFunctions();
  const { FindServerLocal, FindServerRemote } = useFindServerFunctions();
  const styles = useStyles(makeStyles);
  const { navigate } = useMainStackNavigation();

  const hasServer = useUserHasServer();

  const ServerComponentLocal = () => (
    <ServerComponent
      name={serverName ?? undefined}
      ip={serverNetwork?.currentIp}
      port={serverNetwork?.currentPort}
      error={error}
    />
  );

  const ServerComponentRemote = () => (
    <ServerComponent
      name={server?.name}
      ip={serverNetwork?.currentIp}
      port={serverNetwork?.currentPort}
      ipPublic={server?.ipPublic}
      error={error}
    />
  );

  const OnAddServerPress = useCallback(() => {
    navigate('ServerSelect');
  }, [navigate]);

  const OnReconnectPress = useCallback(() => {
    if (error == 'SERVER_NOT_REACHABLE') {
      if (isUsingLocalAccount) {
        FindServerLocal().catch(console.log);
      } else {
        FindServerRemote().catch(console.log);
      }
    } else {
      navigate('ServerSelect');
    }
  }, [FindServerLocal, FindServerRemote, error, isUsingLocalAccount, navigate]);

  const OnForgetServerPress = useCallback(async () => {
    if (!isUsingLocalAccount) {
      await forgetServerRemote();
    } else {
      forgetServerLocal();
    }
    forgetServer();
  }, [forgetServer, forgetServerLocal, forgetServerRemote, isUsingLocalAccount]);

  return (
    <View style={styles.viewStyle}>
      <Text style={styles.titleStyle}>Details</Text>
      {isUsingLocalAccount ? <ServerComponentLocal /> : <ServerComponentRemote />}

      {!hasServer && (
        <PrimaryButton
          title={'Add a server'}
          buttonStyle={{ marginTop: spacing.spacing_xxs }}
          onPress={OnAddServerPress}
        />
      )}
      {hasServer && error && (
        <PrimaryButton
          title={'Reconnect To Server'}
          buttonStyle={{ marginTop: spacing.spacing_xxs }}
          onPress={OnReconnectPress}
        />
      )}
      {hasServer && error == 'SERVER_NOT_REACHABLE' && (
        <PrimaryButton
          title={'Find Server'}
          buttonStyle={{ marginTop: spacing.spacing_xxs }}
          onPress={() => navigate('ServerSelect')}
        />
      )}
      {hasServer && (
        <PrimaryButton
          title={'Forget Server'}
          buttonStyle={{ marginTop: spacing.spacing_xxs }}
          onPress={() => {
            OnForgetServerPress().catch(console.log);
          }}
        />
      )}
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
