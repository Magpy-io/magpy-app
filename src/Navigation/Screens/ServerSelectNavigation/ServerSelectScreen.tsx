import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ServersList from '~/Components/SelectServerComponents/ServersList';
import { Server } from '~/Context/Contexts/LocalServersContext';
import {
  useLocalServersContext,
  useLocalServersFunctions,
} from '~/Context/Contexts/LocalServersContext';
import { useMainContext, useMainContextFunctions } from '~/Context/Contexts/MainContext';
import { useServerClaimFunctions } from '~/Context/Contexts/ServerClaimContext';
import { useServerContextFunctions } from '~/Context/Contexts/ServerContext';
import { useTheme } from '~/Context/Contexts/ThemeContext';
import { Status } from '~/Helpers/ServerQueries';
import { formatAddressHttp } from '~/Helpers/Utilities';
import { useStyles } from '~/Hooks/useStyles';
import { ServerSelectStackParamList } from '~/Navigation/Navigators/ServerSelectNavigator';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

export default function ServerSelectScreen() {
  const { localServers, isScanning } = useLocalServersContext();
  const { tryClaimServer } = useServerClaimFunctions();
  const { refreshData } = useLocalServersFunctions();
  const navigation = useNavigation<StackNavigationProp<ServerSelectStackParamList>>();
  const { setServer } = useServerContextFunctions();

  const { isUsingLocalAccount } = useMainContext();

  const { colors } = useTheme();

  const { setIsNewUser } = useMainContextFunctions();

  const onSelectServer = useCallback(
    async (server: Server) => {
      if (isUsingLocalAccount) {
        try {
          const ret = await Status.Post(
            {},
            { path: formatAddressHttp(server.ip, server.port) },
          );

          if (ret.ok) {
            if (ret.data.claimed == 'Remotely') {
              return;
            }

            setServer(server.ip, server.port);

            if (ret.data.claimed == 'None') {
              navigation.navigate('ServerRegister');
            } else {
              navigation.navigate('ServerLogin');
            }
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        await tryClaimServer(server.ip, server.port);
      }
    },
    [isUsingLocalAccount, navigation, setServer, tryClaimServer],
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
            setIsNewUser(false);
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
