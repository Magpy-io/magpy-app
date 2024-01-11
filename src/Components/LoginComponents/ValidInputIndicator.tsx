import {StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {colors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';

export default function ValidInputIndicator() {
    return (
        <View style={styles.viewStyle}>
            <Icon name="check-circle" size={16} color={colors.COLOR_SUCCESS_500} />
        </View>
    );
}

const styles = StyleSheet.create({
    viewStyle: {
        justifyContent: 'center',
        position: 'absolute',
        left: spacing.spacing_l,
        top: 0,
        bottom: 0,
    },
});
