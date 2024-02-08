import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Icon } from 'react-native-elements';

import { appColors } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';

import ViewWithGap from '../CommonComponents/ViewWithGap';

export default function GoogleSignIn() {
  return (
    <TouchableOpacity style={styles.buttonStyle} onPress={() => {}}>
      <ViewWithGap gap={spacing.spacing_s} style={styles.viewStyle}>
        <Icon name="google" type="font-awesome" />
        <Text style={styles.textStyle}>Sign in with Google</Text>
      </ViewWithGap>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: appColors.TEXT_LIGHT,
    textTransform: 'uppercase',
  },
  buttonStyle: {
    borderRadius: borderRadius.button,
    borderColor: appColors.TEXT_LIGHT,
    borderWidth: 1,
    padding: spacing.spacing_s,
    width: '100%',
  },
});
