import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '~/Context/Contexts/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';

export function LoadingScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.containerStyle}>
      <ActivityIndicator color={colors.ACCENT} size={40} />
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    containerStyle: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      height: '100%',
      width: '100%',
    },
  });
