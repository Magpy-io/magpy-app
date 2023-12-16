import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {colors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';
import ViewWithGap from './ViewWithGap';

export default function GoogleSignIn() {
    return (
        <TouchableOpacity style={styles.buttonStyle} onPress={() => {}}>
            <ViewWithGap gap={spacing.spacing_s} style={styles.viewStyle}>
                <Icon name="google" type="font-awesome" />
                <Text style={styles.textStyle}>Sign in with Google</Text>
            </ViewWithGap>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    viewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        color: colors.COLOR_SECONDARY_400,
    },
    buttonStyle: {
        borderRadius: spacing.spacing_s,
        borderColor: colors.COLOR_SECONDARY_200,
        borderWidth: 2,
        padding: spacing.spacing_s,
        width: '100%',
    },
});
