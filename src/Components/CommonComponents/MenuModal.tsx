import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';

import GenericModal from './GenericModal/GenericModal';

type MenuModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: JSX.Element;
};

export default function MenuModal({ visible, onRequestClose, children }: MenuModalProps) {
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();

  return (
    <>
      <GenericModal
        animationType="scale"
        modalVisible={visible}
        onRequestClose={onRequestClose}
        style={[styles.modalStyle, { marginTop: insets.top }]}>
        <View style={styles.viewStyle}>{children}</View>
      </GenericModal>
    </>
  );
}

const makeStyles = (colors: colorsType, dark: boolean) =>
  StyleSheet.create({
    viewStyle: {
      margin: spacing.spacing_l,
    },
    modalStyle: {
      position: 'absolute',
      top: spacing.spacing_xxl,
      right: spacing.spacing_xxl,
      borderRadius: borderRadius.default,
      elevation: 1,
    },
    touchable: {
      flex: 1,
      backgroundColor: dark ? 'transparent' : 'rgba(0,0,0,0.4)',
    },
  });
