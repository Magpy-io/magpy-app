import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import { UploadIcon } from '~/Components/CommonComponents/Icons';
import { appColors } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { OutlineButtonSmall, PrimaryButtonSmall } from '../CommonComponents/Buttons';

const TITLE = 'Automatic backup';
const BACKUP_ON_TITLE = 'Automatic backup is on';
const TEXT = 'Automatically back up your media even when the app is closed';

export default function AutoBackupCard() {
  const [enabled, setEnabled] = useState(false);
  const switchStatus = () => setEnabled(prev => !prev);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <UploadIcon />
        <View>
          <Text style={styles.title}>{enabled ? BACKUP_ON_TITLE : TITLE}</Text>
          <Text style={styles.text}>{TEXT}</Text>
        </View>
      </View>
      {enabled ? (
        <OutlineButtonSmall
          title="Disable"
          containerStyle={styles.buttonStyle}
          onPress={switchStatus}
        />
      ) : (
        <PrimaryButtonSmall
          title="Enable"
          containerStyle={styles.buttonStyle}
          onPress={switchStatus}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    alignSelf: 'flex-end',
  },
  container: {
    backgroundColor: appColors.BACKGROUND_LIGHT,
    borderRadius: borderRadius.default,
    padding: spacing.spacing_l,
    gap: spacing.spacing_s,
  },
  title: {
    ...typography.largeTextBold,
    paddingBottom: spacing.spacing_xxs,
  },
  text: {
    ...typography.lightMediumText,
    flex: 1,
    flexWrap: 'wrap',
    width: '70%',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.spacing_s,
  },
});
