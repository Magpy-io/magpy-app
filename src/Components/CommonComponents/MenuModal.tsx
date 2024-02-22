import React from 'react';
import { StyleSheet } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';

import GenericModal from './GenericModal';

type MenuModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: JSX.Element;
};

export default function MenuModal({ visible, onRequestClose, children }: MenuModalProps) {
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  return (
    <GenericModal
      animation="fade"
      modalVisible={visible}
      handleModal={onRequestClose}
      style={[styles.viewStyle, { marginTop: insets.top }]}>
      {children}
    </GenericModal>
  );
}

// export default function MenuModal({ visible, onRequestClose, children }: MenuModalProps) {
//   const styles = useStyles(makeStyles);
//   const insets = useSafeAreaInsets();
//   return (
//     <Modal
//       animationType="fade"
//       transparent
//       statusBarTranslucent
//       visible={visible}
//       onRequestClose={onRequestClose}>
//       <View style={{ flex: 1 }}>
//         <Pressable style={styles.touchable} onPress={onRequestClose} />
//         <TouchableWithoutFeedback>
//           <View style={[styles.viewStyle, { marginTop: insets.top }]}>{children}</View>
//         </TouchableWithoutFeedback>
//       </View>
//     </Modal>
//   );
// }

const makeStyles = (colors: colorsType, dark: boolean) =>
  StyleSheet.create({
    viewStyle: {
      backgroundColor: colors.MODAL_BACKGROUND,
      position: 'absolute',
      top: spacing.spacing_xxl,
      right: spacing.spacing_xxl,
      padding: spacing.spacing_l,
      borderRadius: borderRadius.default,
      elevation: 1,
    },
    touchable: {
      flex: 1,
      backgroundColor: dark ? colors.TRANSPARENT : `rgba(0,0,0,0.2)`,
    },
  });
