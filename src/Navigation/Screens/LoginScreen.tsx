import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import KeyboardDismissingView from '~/Components/CommonComponents/KeyboardDismissingView';
import ScreenTitle from '~/Components/CommonComponents/ScreenTitle';
import GoogleSignIn from '~/Components/LoginComponents/GoogleSignIn';
import LoginForm from '~/Components/LoginComponents/LoginForm';
import {appColors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';

export default function LoginScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardDismissingView>
                <ScreenTitle title="Login to your account" />
                <LoginForm />
            </KeyboardDismissingView>
            <LoginFooter />
        </SafeAreaView>
    );
}

function LoginFooter() {
    const navigation = useNavigation();
    return (
        <View style={styles.loginFooterStyle}>
            <GoogleSignIn />
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <Text style={{color: appColors.TEXT}}>Don't have an account ? </Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Register');
                    }}
                    style={{paddingVertical: spacing.spacing_s}}>
                    <Text style={{color: appColors.ACCENT, fontWeight: 'bold'}}>
                        Register !
                    </Text>
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
