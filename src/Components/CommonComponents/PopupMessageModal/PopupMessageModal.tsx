import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Text } from 'react-native-elements';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { OutlineButton, PrimaryButton } from '../Buttons';

export default function PopupMessageModal({
  isVisible,
  onDismissed,
  title,
  content,
  ok = 'Ok',
  cancel,
}: {
  isVisible: boolean;
  onDismissed: (userAction: 'Ok' | 'Cancel' | 'Dismiss') => void;
  title: string;
  content: string;
  ok?: string;
  cancel?: string;
}) {
  const styles = useStyles(makeStyles);

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <TouchableOpacity
        style={styles.modalBackground}
        activeOpacity={1}
        onPress={() => {
          onDismissed('Dismiss');
        }}>
        <TouchableWithoutFeedback>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>{title}</Text>
            <Text style={styles.popupContent}>{content}</Text>
            <View style={styles.viewButtons}>
              {cancel && (
                <OutlineButton
                  title={cancel}
                  onPress={() => {
                    onDismissed('Cancel');
                  }}
                />
              )}
              <PrimaryButton
                title={ok}
                onPress={() => {
                  onDismissed('Ok');
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    popupContainer: {
      backgroundColor: colors.BACKGROUND,
      padding: spacing.spacing_l,
      borderRadius: borderRadius.default,
      alignItems: 'center',
      margin: spacing.spacing_l,
    },
    popupTitle: {
      ...typography(colors).largeTextBold,
      marginBottom: spacing.spacing_l,
    },
    popupContent: {
      ...typography(colors).mediumText,
      marginBottom: spacing.spacing_xl,
    },
    viewButtons: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-end',
      gap: spacing.spacing_xs,
    },
  });
