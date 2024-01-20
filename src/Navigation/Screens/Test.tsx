import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {Button, Text} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GetPhotos} from '~/Helpers/GetGalleryPhotos';
import {appColors} from '~/styles/colors';
import {NativeEventEmitter, NativeModules} from 'react-native';
const {MainModule} = NativeModules;

const windowWidth = Dimensions.get('window').width;

const numberPhotos = 1000;
export default function App() {
    const [offset, setOffset] = useState(0);
    const [photos, setPhotos] = useState<string[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [endReached, setEndReached] = useState(false);

    const hideModal = useCallback(() => setVisible(false), []);
    const showModal = useCallback(() => setVisible(true), []);

    const loadMorePhotos = useCallback(async () => {
        if (!endReached) {
            console.log('Loading photos', numberPhotos, offset);
            const res = await GetPhotos(numberPhotos, offset);
            console.log('Loaded');
            if (res) {
                setPhotos(prev => {
                    return [...prev, ...res.edges.map(e => e.node.image.uri)];
                });
                setOffset(prev => prev + numberPhotos);
                if (res.endReached) {
                    setEndReached(true);
                }
            }
        }
    }, []);

    useEffect(() => {
        loadMorePhotos();
    }, []);

    const renderItem = useCallback(({item}: {item: string}) => {
        return <PhotoScreen uri={item} />;
    }, []);

    const keyExtractor = useCallback((item: string) => item, []);
    const getItemLayout = useCallback(
        (data, index: number) => ({length: windowWidth, offset: windowWidth * index, index}),
        []
    );

    return (
        <View style={styles.container}>
            {/* <Text>Testing gallery</Text> */}
            <FlatList
                data={photos}
                renderItem={renderItem}
                horizontal
                contentContainerStyle={styles.sliderView}
                initialNumToRender={10}
                windowSize={21}
                getItemLayout={getItemLayout}
                keyExtractor={keyExtractor}
                removeClippedSubviews={false}
                //Snap
                disableIntervalMomentum
                snapToInterval={windowWidth}
                decelerationRate={'normal'}
                // disableScrollViewPanResponder
            />
            {/* <Grid photos={photos} loadMorePhotos={loadMorePhotos} onPressPhoto={showModal} /> */}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text>Testing gallery</Text>
            <Grid photos={photos} loadMorePhotos={loadMorePhotos} onPressPhoto={showModal} />
            <Modal visible={visible} onRequestClose={hideModal}>
                <FlatList
                    data={photos}
                    renderItem={renderItem}
                    horizontal
                    contentContainerStyle={styles.sliderView}
                    initialNumToRender={10}
                    windowSize={21}
                    getItemLayout={getItemLayout}
                    keyExtractor={keyExtractor}
                    removeClippedSubviews={false}
                    //Snap
                    disableIntervalMomentum
                    snapToInterval={windowWidth}
                    decelerationRate={'normal'}
                    // disableScrollViewPanResponder
                />
                {/* <PhotoScreen uri="file:///storage/emulated/0/DCIM/Camera/IMG_20240110_113831.jpg" /> */}
            </Modal>
        </View>
    );
}

type GridProps = {
    photos: string[];
    loadMorePhotos: () => void;
    onPressPhoto: () => void;
};

function Grid({photos, loadMorePhotos, onPressPhoto}: GridProps) {
    const renderItem = useCallback(({item}: {item: string}) => {
        return <PhotoComponent uri={item} onPress={onPressPhoto} />;
    }, []);

    const keyExtractor = useCallback((item: string) => item, []);
    const getItemLayout = useCallback(
        (data, index: number) => ({length: 100, offset: 100 * index, index}),
        []
    );

    return (
        <FlatList
            data={photos}
            initialNumToRender={32}
            renderItem={renderItem}
            numColumns={4}
            onEndReached={loadMorePhotos}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            onEndReachedThreshold={2}
        />
    );
}

const PhotoComponent = React.memo(({uri, onPress}: {uri: string; onPress: () => void}) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.5}>
            <Image source={{uri: uri}} style={styles.imageStyle} />
        </TouchableOpacity>
    );
});

const PhotoScreen = React.memo(({uri}: {uri: string}) => {
    console.log('Rendering photo', uri);
    const [fullScreen, setFullScreen] = useState(false);
    const fullScreenStyle = useMemo(
        () => (fullScreen ? {backgroundColor: 'black'} : {}),
        [fullScreen]
    );
    const handleFullScreen = useCallback(() => {
        if (fullScreen) {
            console.log('disable full screen');
            MainModule.disableFullScreen();
        } else {
            console.log('enable full screen');
            MainModule.enableFullScreen();
        }
        setFullScreen(prev => !prev);
    }, [fullScreen]);

    return (
        <TouchableWithoutFeedback
            style={styles.photoScreenContainer}
            onPress={handleFullScreen}>
            <FastImage
                source={{
                    uri: uri,
                }}
                style={[styles.photoScreenStyle, {}]}
                resizeMode="center"
            />
        </TouchableWithoutFeedback>
    );
});

const styles = StyleSheet.create({
    sliderView: {
        backgroundColor: 'red',
    },
    photoScreenContainer: {},
    photoScreenStyle: {
        width: windowWidth,
        height: '100%',
    },
    imageStyle: {
        height: 100,
        width: 100,
    },
    container: {
        flex: 1,
        backgroundColor: appColors.BACKGROUND,
    },
});
