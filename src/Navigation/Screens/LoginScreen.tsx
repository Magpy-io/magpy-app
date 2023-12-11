import {StyleSheet, TextInput, View} from 'react-native';
import {Text} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {appColors, colors} from '~/../styles/colors';
import {spacing} from '~/../styles/spacing';

export default function LoginScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScreenTitle title="Sign In" />
            <LoginForm />
        </SafeAreaView>
    );
}

function ScreenTitle({title}: {title: string}) {
    return <Text style={styles.screenTitleStyle}>{title}</Text>;
}

function LoginForm() {
    return (
        <View style={{paddingTop: spacing.spacing_xxl_3}}>
            <TextInput
                placeholder="Email"
                style={{
                    paddingLeft: spacing.spacing_l,
                    borderColor: colors.COLOR_SECONDARY_300,
                    borderWidth: 1,
                    borderRadius: spacing.spacing_s,
                }}
                placeholderTextColor={colors.COLOR_SECONDARY_300}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screenTitleStyle: {
        paddingTop: spacing.spacing_xxl_6,
        alignSelf: 'center',
        fontSize: 32,
        fontWeight: '800',
        color: appColors.TEXT_DARK,
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.spacing_xl,
        backgroundColor: appColors.BACKGROUND_LIGHT,
    },
});
