import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import KeyboardDismissingView from '~/Components/CommonComponents/KeyboardDismissingView';
import ScreenTitle from '~/Components/CommonComponents/ScreenTitle';
import GoogleSignIn from '~/Components/LoginComponents/GoogleSignIn';
import LoginForm from '~/Components/LoginComponents/LoginForm';
import { useMainContextFunctions } from '~/Context/Contexts/MainContext';
import { useTheme } from '~/Context/Contexts/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';

import { LoginStackParamList } from '../../Navigators/LoginStackNavigator';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles(makeStyles);
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardDismissingView>
        <ScreenTitle title="Login to your account" />
        <LoginForm />
        <LoginFooter />
      </KeyboardDismissingView>
    </View>
  );
}

function LoginFooter() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<LoginStackParamList>>();

  const { setIsUsingLocalAccount } = useMainContextFunctions();

  return (
    <View style={styles.loginFooterStyle}>
      <GoogleSignIn />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{ color: colors.TEXT }}>{"Don't have an account ? "}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Register');
          }}
          style={{ paddingVertical: spacing.spacing_s }}>
          <Text style={{ color: colors.ACCENT, fontWeight: 'bold' }}>Register !</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: spacing.spacing_xxl_3,
        }}>
        <TouchableOpacity
          onPress={() => {
            setIsUsingLocalAccount(true);
          }}
          style={{ paddingVertical: spacing.spacing_s }}>
          <Text style={{ color: colors.TEXT, fontWeight: 'bold' }}>
            Continue Without Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PADDING_HORIZONTAl = spacing.spacing_xxl;

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    loginFooterStyle: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: spacing.spacing_xxl_2,
      paddingHorizontal: PADDING_HORIZONTAl,
      alignItems: 'center',
    },
    container: {
      flex: 1,
      paddingHorizontal: PADDING_HORIZONTAl,
      backgroundColor: colors.BACKGROUND,
    },
  });
