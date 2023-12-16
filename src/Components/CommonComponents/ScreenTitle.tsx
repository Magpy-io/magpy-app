import {Text} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import {appColors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';
import {text} from '~/styles/typography';

export default function ScreenTitle({title}: {title: string}) {
    return <Text style={styles.screenTitleStyle}>{title}</Text>;
}

const styles = StyleSheet.create({
    screenTitleStyle: {
        paddingTop: spacing.spacing_xxl_6,
        alignSelf: 'center',
        ...text.sreenTitle,
        color: appColors.TEXT_DARK,
    },
});
