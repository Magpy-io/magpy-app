import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {appColors, colors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';
import {Formik} from 'formik';
import ViewWithGap from '~/Components/CommonComponents/ViewWithGap';
import {PrimaryButton} from '~/Components/CommonComponents/Buttons';
import {PasswordInput, TextInput} from '~/Components/CommonComponents/Inputs';
import KeyboardDismissingView from '~/Components/CommonComponents/KeyboardDismissingView';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('No email provided'),
    password: Yup.string()
        .required('No password provided')
        .min(5, 'Password is too short - should be at least 5 characters'),
});

export default function LoginScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardDismissingView>
                <ScreenTitle title="Sign In" />
                <LoginForm />
            </KeyboardDismissingView>
        </SafeAreaView>
    );
}

function ScreenTitle({title}: {title: string}) {
    return <Text style={styles.screenTitleStyle}>{title}</Text>;
}

function LoginForm() {
    return (
        <Formik
            initialValues={{email: '', password: ''}}
            validationSchema={LoginSchema}
            onSubmit={values => console.log(values)}>
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (
                <View>
                    <ViewWithGap
                        gap={spacing.spacing_m}
                        style={{
                            paddingTop: spacing.spacing_xxl_3,
                            paddingBottom: spacing.spacing_xxl,
                        }}>
                        <TextInput
                            placeholder="Email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            error={errors.email}
                        />
                        <PasswordInput
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            error={errors.password}
                        />
                    </ViewWithGap>
                    <PrimaryButton title="Sign In" onPress={() => handleSubmit()} />
                </View>
            )}
        </Formik>
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
