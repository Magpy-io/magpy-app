import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import { UploadIcon } from '~/Components/CommonComponents/Icons';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { PrimaryButtonSmall } from '../CommonComponents/Buttons';

const TITLE = 'Automatic backup';
const TEXT = 'Automatically back up your media even when the app is closed';

export default function AutoBackupCard() {
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <UploadIcon />
        <View>
          <Text style={styles.title}>{TITLE}</Text>
          <Text style={styles.text}>{TEXT}</Text>
        </View>
      </View>

      <PrimaryButtonSmall
        title="Enable"
        containerStyle={styles.buttonStyle}
        onPress={() => {}}
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
      flex: 1,
      flexWrap: 'wrap',
      width: '70%',
    },
    row: {
      flexDirection: 'row',
      gap: spacing.spacing_s,
    },
  });
