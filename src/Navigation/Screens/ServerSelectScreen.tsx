import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ServersList from '~/Components/SelectServerComponents/ServersList';
import { useAuthContext } from '~/Context/Contexts/AuthContext';
import { Server } from '~/Context/Contexts/LocalServersContext';
import {
  useLocalServersContext,
  useLocalServersFunctions,
} from '~/Context/Contexts/LocalServersContext';
import { useMainContext } from '~/Context/Contexts/MainContext';
import { useServerClaimFunctions } from '~/Context/Contexts/ServerClaimContext';
import { useServerContextFunctions } from '~/Context/Contexts/ServerContext';
import { useTheme } from '~/Context/Contexts/ThemeContext';
import { GetToken, IsClaimed, TokenManager } from '~/Helpers/ServerQueries';
import { formatAddressHttp } from '~/Helpers/Utilities';
import { useStyles } from '~/Hooks/useStyles';
import { useToast } from '~/Hooks/useToast';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { useMainStackNavigation } from '../Navigators/MainStackNavigator';

export default function ServerSelectScreen() {
  const { localServers, isScanning } = useLocalServersContext();
  const { tryClaimServer } = useServerClaimFunctions();
  const { refreshData } = useLocalServersFunctions();
  const { token } = useAuthContext();
  const { navigate } = useMainStackNavigation();
  const { setServerSelecting, setReachableServer } = useServerContextFunctions();

  const { showToastError } = useToast();

  const { isUsingLocalAccount } = useMainContext();

  const { colors } = useTheme();

  const onSelectServer = useCallback(
    async (server: Server) => {
      if (isUsingLocalAccount) {
        try {
          const ret = await IsClaimed.Post(
            {},
            { path: formatAddressHttp(server.ip, server.port) },
          );

          if (ret.ok) {
            if (ret.data.claimed == 'Remotely') {
              showToastError('Server already claimed by another user.');
              return;
            }

            setServerSelecting(server.ip, server.port);

            if (ret.data.claimed == 'None') {
              navigate('ServerClaim');
            } else {
              navigate('ServerLogin');
            }
          }
        } catch (err) {
          console.log(err);
          showToastError('Unexpected error while connecting to this server.');
        }
      } else {
        if (!token) {
          showToastError('You need to be logged in before being able to claim a server.');
          return;
        }

        const serverClaimed = await tryClaimServer(server.ip, server.port);

        if (serverClaimed.claimed) {
          navigate('Tabs');
          return;
        }

        if (serverClaimed.error != 'SERVER_ALREADY_CLAIMED') {
          showToastError('Unexpected error while connecting to this server.');
          return;
        }

        const res = await GetToken.Post(
          { userToken: token },
          { path: formatAddressHttp(server.ip, server.port) },
        );

        if (res.ok) {
          const ServerToken = TokenManager.GetUserToken();
          setReachableServer({
            ip: server.ip,
            port: server.port,
            token: ServerToken,
          });
          navigate('Tabs');
        } else {
          showToastError('Server already claimed by another user.');
          return;
        }
      }
    },
    [
      isUsingLocalAccount,
      navigate,
      setReachableServer,
      setServerSelecting,
      showToastError,
      token,
      tryClaimServer,
    ],
  );

  useEffect(() => {
    console.log('Refresh local servers');
    refreshData();
  }, [refreshData]);

  const insets = useSafeAreaInsets();
  const styles = useStyles(makeStyles);
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ServersList
        servers={localServers}
        refreshData={refreshData}
        header={<Header isScanning={isScanning} />}
        onSelectServer={(server: Server) => {
          onSelectServer(server).catch(e => console.log(e));
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.spacing_xxl_2,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigate('Tabs');
          }}
          style={{ paddingVertical: spacing.spacing_s }}>
          <Text style={{ color: colors.TEXT, fontWeight: 'bold' }}>
            Continue Without Server
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Header({ isScanning }: { isScanning: boolean }) {
  const title = isScanning ? 'Searching for your local server' : 'Select your local server';
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.headerView}>
      {isScanning && (
        <ActivityIndicator style={styles.indicatorStyle} color={colors.PRIMARY} />
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    indicatorStyle: {
      position: 'absolute',
      top: spacing.spacing_xxl_4,
      alignSelf: 'center',
    },
    headerView: {
      paddingBottom: spacing.spacing_xxl,
      paddingTop: spacing.spacing_xxl_5,
    },
    title: {
      paddingHorizontal: spacing.spacing_xxl,
      textAlign: 'center',
      ...typography(colors).screenTitle,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.BACKGROUND,
    },
  });
