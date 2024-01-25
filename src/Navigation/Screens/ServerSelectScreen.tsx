import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ServersList from '~/Components/SelectServerComponents/ServersList';
import { Server } from '~/Context/ContextSlices/LocalServersContext';
import { useServerClaimFunctions } from '~/Context/UseContexts/useClaimServerContext';
import {
  useLocalServersContext,
  useLocalServersFunctions,
} from '~/Context/UseContexts/useLocalServersContext';
import { appColors } from '~/styles/colors';
import { spacing } from '~/styles/spacing';
import { typography } from '~/styles/typography';

export default function ServerSelectScreen() {
  const { localServers, isScanning } = useLocalServersContext();
  const { claimServer } = useServerClaimFunctions();
  const { refreshData } = useLocalServersFunctions();

  const onSelectServer = async (server: Server) => {
    await claimServer('http://' + server.ip + ':' + server.port);
  };

  useEffect(() => {
    console.log('Refresh');
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const insets = useSafeAreaInsets();

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
    </View>
  );
}

function Header({ isScanning }: { isScanning: boolean }) {
  const title = isScanning ? 'Searching for your local server' : 'Select your local server';
  return (
    <View style={styles.headerView}>
      {isScanning && (
        <ActivityIndicator style={styles.indicatorStyle} color={appColors.PRIMARY} />
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    ...typography.screenTitle,
  },
  container: {
    flex: 1,
    backgroundColor: appColors.BACKGROUND,
  },
});
