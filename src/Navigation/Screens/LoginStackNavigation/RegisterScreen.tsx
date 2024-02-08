import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import KeyboardDismissingView from '~/Components/CommonComponents/KeyboardDismissingView';
import ScreenTitle from '~/Components/CommonComponents/ScreenTitle';
import GoogleSignIn from '~/Components/LoginComponents/GoogleSignIn';
import RegisterForm from '~/Components/LoginComponents/RegisterForm';
import { appColors } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';

import { LoginStackParamList } from '../../Navigators/LoginStackNavigator';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardDismissingView>
        <ScreenTitle title="Create Account" />
        <RegisterForm />
      </KeyboardDismissingView>
      <RegisterFooter />
    </View>
  );
}

function RegisterFooter() {
  const navigation = useNavigation<StackNavigationProp<LoginStackParamList>>();
  return (
    <View style={styles.loginFooterStyle}>
      <GoogleSignIn />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: appColors.TEXT }}>Already a client ? </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}
          style={{ paddingVertical: spacing.spacing_s }}>
          <Text style={{ color: appColors.ACCENT, fontWeight: 'bold' }}>Sign In !</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PADDING_HORIZONTAl = spacing.spacing_xxl;

const styles = StyleSheet.create({
  loginFooterStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: spacing.spacing_xxl_5,
    paddingHorizontal: PADDING_HORIZONTAl,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: PADDING_HORIZONTAl,
    backgroundColor: appColors.BACKGROUND,
  },
});
