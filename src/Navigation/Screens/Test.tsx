import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
import {useAuthContext} from '~/Components/AuthContext';

export default function App() {
    const {logout} = useAuthContext();

    return (
        <View style={styles.container}>
            <Button title="Log out" onPress={logout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 60,
    },
});
