import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {useAuthContext} from '~/Context/AuthContext';
import {TokenManager} from '~/Helpers/BackendQueries';

export default function App() {
    const {logout, user} = useAuthContext();
    const token = TokenManager.GetUserToken();
    return (
        <View style={styles.container}>
            <Button title="Log out" onPress={logout} />
            <Text>{token}</Text>
            <Text>{user?._id}</Text>
            <Text>{user?.email}</Text>
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
