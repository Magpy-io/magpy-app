import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';

/*
If you have a textinput in your screen and you want to dismiss keyboard when taping outside, wrap your view in this.
See example in LoginScreen.tsx
*/

export default function KeyboardDismissingView({
    children,
}: {
    children: JSX.Element | JSX.Element[];
}) {
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{flex: 1}}>{children}</View>
        </TouchableWithoutFeedback>
    );
}
