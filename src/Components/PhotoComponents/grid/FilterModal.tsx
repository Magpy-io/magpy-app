import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import BottomModal from '~/Components/CommonComponents/BottomModal';
import { CloseIcon } from '~/Components/CommonComponents/Icons';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

type FilterModalProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export default function FilterModal(props: FilterModalProps) {
  const styles = useStyles(makeStyles);
  return (
    <BottomModal modalVisible={props.visible} onRequestClose={props.onRequestClose}>
      <View style={styles.viewStyle}>
        <Header onClose={props.onRequestClose} />
        <Type />
      </View>
    </BottomModal>
  );
}

function Type() {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Type</Text>
    </View>
  );
}

function Header({ onClose }: { onClose: () => void }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.header}>
      <CloseIcon iconStyle={styles.closeIcon} onPress={onClose} />
      <Text style={styles.headerTitle}>Filters</Text>
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    section: {
      marginVertical: spacing.spacing_l,
    },
    closeIcon: {
      padding: spacing.spacing_xxs,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.spacing_xs,
    },
    viewStyle: {
      padding: spacing.spacing_m,
    },
    headerTitle: {
      ...typography(colors).mediumTextBold,
    },
    title: {
      ...typography(colors).largeTextBold,
    },
  });
