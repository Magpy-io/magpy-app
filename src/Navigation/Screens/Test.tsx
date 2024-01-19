import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {useAuthContext} from '~/Context/AuthContext';
import {useServerContext} from '~/Context/ServerContext';
import {TokenManager} from '~/Helpers/BackendQueries';

export default function App() {
    const {logout, user} = useAuthContext();
    const {isServerReachable} = useServerContext();
    return (
        <View style={styles.container}>
            <Button title="Log out" onPress={logout} />
            <Text>{`User Id : ${user?._id}`}</Text>
            <Text>{user?.email}</Text>
            <Text>{isServerReachable ? 'Server reachable' : 'Unreachable'}</Text>
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
