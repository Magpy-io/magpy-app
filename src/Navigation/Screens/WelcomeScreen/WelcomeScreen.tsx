import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tinycolor from 'tinycolor2';

import { PrimaryButtonExtraWide } from '~/Components/CommonComponents/Buttons';
import { useTheme } from '~/Context/Contexts/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';
import { useMainStackNavigation } from '~/Navigation/Navigators/MainStackNavigator';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import BackgroundImage from './img/welcomeBackground.jpg';

export function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles(makeStyles);

  const { colors } = useTheme();

  const gradient_start = colors.TRANSPARENT;
  const gradient_mid = tinycolor(colors.BACKGROUND).setAlpha(0.9).toRgbString();
  const gradient_end = colors.BACKGROUND;

  const { navigate } = useMainStackNavigation();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ImageBackground
        source={BackgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover">
        <LinearGradient
          colors={[gradient_start, gradient_mid, gradient_end]}
          locations={[0, 0.5, 0.6]}
          style={styles.gradient}
        />
        <Text style={styles.appTitle}>Magpy</Text>
        <Text style={styles.appDescription}>
          Preserve your memories in your own home server.
        </Text>

        <PrimaryButtonExtraWide
          containerStyle={styles.connectButton}
          title={'Connect Your Server'}
          onPress={() => {
            navigate('ServerSelect');
          }}
        />
      </ImageBackground>
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
    },
    backgroundImage: {
      flex: 1,
      height: '100%',
      width: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    appTitle: {
      ...typography(colors).screenTitle,
      fontSize: 60,
    },
    appDescription: {
      ...typography(colors).sectionTitle,
      textAlign: 'center',
      marginHorizontal: spacing.spacing_xxl_3,
      marginTop: spacing.spacing_m,
    },
    connectButton: {
      marginTop: spacing.spacing_xxl_4,
      marginBottom: spacing.spacing_xxl_4,
    },
    gradient: {
      ...StyleSheet.absoluteFillObject, // Fills the container
    },
  });
