import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { PrimaryButtonSmall } from '../CommonComponents/Buttons';
import { CloseIcon } from './Icons';

type PropType = {
  icon?: ReactNode;
  title?: string;
  text?: string;
  buttonOk?: string;
  onButtonOk?: () => void;
  hasCloseButton?: boolean;
  onCloseButton?: () => void;
};

export function GenericCard({
  icon,
  title,
  text,
  buttonOk,
  onButtonOk,
  hasCloseButton,
  onCloseButton,
}: PropType) {
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {icon}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
        {hasCloseButton && <CloseIcon onPress={onCloseButton} />}
      </View>

      <PrimaryButtonSmall
        title={buttonOk}
        containerStyle={styles.buttonStyle}
        onPress={onButtonOk}
      />
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    buttonStyle: {
      alignSelf: 'flex-end',
    },
    container: {
      backgroundColor: colors.BACKGROUND_LIGHT,
      borderRadius: borderRadius.default,
      padding: spacing.spacing_l,
      gap: spacing.spacing_s,
    },
    title: {
      ...typography(colors).largeTextBold,
      paddingBottom: spacing.spacing_xxs,
    },
    text: {
      ...typography(colors).lightMediumText,
      flexWrap: 'wrap',
    },
    row: {
      flexDirection: 'row',
      gap: spacing.spacing_s,
    },
  });
