import React, { useEffect } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import { PrimaryButton } from '~/Components/CommonComponents/Buttons';
import { useStyles } from '~/Hooks/useStyles';
import { useTabNavigationContextFunctions } from '~/Navigation/TabNavigation/TabNavigationContext';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

export default function PermissionNeededView() {
  const styles = useStyles(makeStyles);

  const { hideTab } = useTabNavigationContextFunctions();

  useEffect(() => {
    hideTab();
  }, [hideTab]);

  return (
    <View style={styles.viewStyle}>
      <Text style={styles.textStyle}>To continue, give Magpy access to your photos</Text>
      <PrimaryButton
        title={'Go to settings'}
        buttonStyle={{ marginTop: spacing.spacing_m }}
        onPress={() => {
          Linking.openSettings().catch(console.log);
        }}
      />
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    viewStyle: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
      justifyContent: 'center',
    },
    textStyle: {
      textAlign: 'center',
      ...typography(colors).largeTextBold,
      paddingHorizontal: spacing.spacing_xxl_3,
    },
  });
