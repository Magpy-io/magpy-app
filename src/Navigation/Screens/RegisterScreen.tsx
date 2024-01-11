import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import KeyboardDismissingView from '~/Components/CommonComponents/KeyboardDismissingView';
import ScreenTitle from '~/Components/CommonComponents/ScreenTitle';
import {appColors, colors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';
import GoogleSignIn from '~/Components/LoginComponents/GoogleSignIn';
import RegisterForm from '~/Components/LoginComponents/RegisterForm';

export default function RegisterScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardDismissingView>
                <ScreenTitle title="Create Account" />
                <RegisterForm />
            </KeyboardDismissingView>
            <RegisterFooter />
        </SafeAreaView>
    );
}

function RegisterFooter() {
    const navigation = useNavigation();
    return (
        <View style={styles.loginFooterStyle}>
            <GoogleSignIn />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: appColors.TEXT}}>Already a client ? </Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Login');
                    }}
                    style={{paddingVertical: spacing.spacing_s}}>
                    <Text style={{color: appColors.ACCENT, fontWeight: 'bold'}}>
                        Sign In !
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
