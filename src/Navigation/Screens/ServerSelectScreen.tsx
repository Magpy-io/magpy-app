import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ServersList from '~/Components/SelectServerComponents/ServersList';
import {
  useLocalServersContext,
  useLocalServersFunctions,
} from '~/Context/Contexts/LocalServersContext';
import { useTheme } from '~/Context/Contexts/ThemeContext';
import { useServerSelectionFunction } from '~/Hooks/useServerSelectionFunction';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { useMainStackNavigation } from '../Navigators/MainStackNavigator';

export default function ServerSelectScreen() {
  const { localServers, isScanning } = useLocalServersContext();
  const { refreshData } = useLocalServersFunctions();
  const { navigate } = useMainStackNavigation();

  const { colors } = useTheme();

  const { SelectServer } = useServerSelectionFunction();

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
        onSelectServer={server => {
          SelectServer(server).catch(e => console.log(e));
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigate('ServerManualAddress');
          }}
          style={{ paddingVertical: spacing.spacing_s }}>
          <Text style={{ color: colors.TEXT, fontWeight: 'bold' }}>
            Enter Address Manually
          </Text>
        </TouchableOpacity>
      </View>

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
