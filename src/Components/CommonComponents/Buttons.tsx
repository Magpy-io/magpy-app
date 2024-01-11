import {StyleSheet} from 'react-native';
import {Button, ButtonProps, Text} from 'react-native-elements';
import {appColors, colors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';

export function PrimaryButton(props: ButtonProps) {
    return (
        <Button
            {...props}
            containerStyle={[styles.containerStyle, props.containerStyle]}
            buttonStyle={[styles.buttonStyle, props.buttonStyle]}
            titleStyle={styles.titleStyle}
        />
    );
}

export function PrimaryButtonWide(props: ButtonProps) {
    return (
        <Button
            {...props}
            containerStyle={[styles.containerStyle, props.containerStyle]}
            buttonStyle={[
                styles.buttonStyle,
                props.buttonStyle,
                {paddingHorizontal: spacing.spacing_xxl},
            ]}
            titleStyle={styles.titleStyle}
        />
    );
}

export function PrimaryButtonExtraWide(props: ButtonProps) {
    return (
        <Button
            {...props}
            containerStyle={[styles.containerStyle, props.containerStyle]}
            buttonStyle={[
                styles.buttonStyle,
                props.buttonStyle,
                {paddingHorizontal: spacing.spacing_xxl_2},
            ]}
            titleStyle={styles.titleStyle}
        />
    );
}

const styles = StyleSheet.create({
    titleStyle: {
        color: appColors.TEXT_INVERSE,
    },
    buttonStyle: {
        backgroundColor: appColors.PRIMARY,
        borderRadius: spacing.spacing_s,
        paddingVertical: spacing.spacing_s,
        paddingHorizontal: spacing.spacing_xl,
    },
    containerStyle: {
        alignSelf: 'center',
    },
});
