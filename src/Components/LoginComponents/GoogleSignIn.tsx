import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Icon } from 'react-native-elements';

import { useTheme } from '~/Context/Contexts/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';

import ViewWithGap from '../CommonComponents/ViewWithGap';

export default function GoogleSignIn() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.buttonStyle} onPress={() => {}}>
      <ViewWithGap gap={spacing.spacing_s} style={styles.viewStyle}>
        <Icon name="google" type="font-awesome" color={colors.TEXT_LIGHT} />
        <Text style={styles.textStyle}>Sign in with Google</Text>
      </ViewWithGap>
    </TouchableOpacity>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    viewStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textStyle: {
      color: colors.TEXT_LIGHT,
      textTransform: 'uppercase',
    },
    buttonStyle: {
      borderRadius: borderRadius.button,
      borderColor: colors.OUTLINE_BORDER,
      borderWidth: 1,
      padding: spacing.spacing_s,
      width: '100%',
    },
  });
