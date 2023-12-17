import {Button, ButtonProps, Text} from 'react-native-elements';
import {colors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';

export function PrimaryButton(props: ButtonProps) {
    return (
        <Button
            {...props}
            containerStyle={[
                {
                    width: 180,
                    alignSelf: 'center',
                },
                props.containerStyle,
            ]}
            buttonStyle={[
                {
                    backgroundColor: colors.COLOR_PRIMARY_500,
                    borderRadius: spacing.spacing_s,
                },
                props.buttonStyle,
            ]}
        />
    );
}
