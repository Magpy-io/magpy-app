import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';

const clearAll = async () => {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        // clear error
    }

    console.log('Done.');
};
export default function App() {
    return (
        <View style={styles.container}>
            <Button
                title="Log out"
                onPress={async () => {
                    await clearAll();
                }}
            />
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
