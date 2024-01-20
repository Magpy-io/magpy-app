import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import ServersList from '~/Components/SelectServerComponents.tsx/ServersList';
import { useServerClaimContext } from '~/Context/ServerClaimContext';
import { Server } from '~/Hooks/useLocalServers';
import { appColors } from '~/styles/colors';
import { spacing } from '~/styles/spacing';
import { typography } from '~/styles/typography';

export default function ServerSelectScreen() {
  const { claimServer, localServers, isScanning, refreshData, hasServer } =
    useServerClaimContext();

  const onSelectServer = async (server: Server) => {
    await claimServer('http://' + server.ip + ':' + server.port);
  };

  useEffect(() => {
    console.log('Refresh');
    refreshData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ServersList
        servers={localServers}
        refreshData={refreshData}
        header={<Header isScanning={isScanning} />}
        onSelectServer={onSelectServer}
      />
    </SafeAreaView>
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
