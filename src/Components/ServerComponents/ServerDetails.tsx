import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import { useServerClaimContext } from '~/Context/UseContexts/useClaimServerContext';
import { useServerContext } from '~/Context/UseContexts/useServerContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import ServerComponent from './ServerComponent';

export default function ServerDetails() {
  const { server } = useServerClaimContext();
  const { serverNetwork } = useServerContext();
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.viewStyle}>
      <Text style={styles.titleStyle}>Details</Text>
      <ServerComponent
        name={server?.name ?? ''}
        ip={serverNetwork.currentIp ?? ''}
        port={serverNetwork.port ?? ''}
      />
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
