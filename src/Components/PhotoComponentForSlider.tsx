import React, {useMemo, useState} from 'react';
import {StyleSheet, View, Dimensions, TouchableOpacity} from 'react-native';

import {Gesture, GestureDetector, TouchableNativeFeedback} from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    runOnJS,
} from 'react-native-reanimated';

import FastImage from 'react-native-fast-image';

import {PhotoType} from '~/Helpers/types';

const H = Dimensions.get('screen').height;
const W = Dimensions.get('screen').width;

type PropsType = {
    photo: PhotoType;
    onPress?: (item: PhotoType) => void;
    onLongPress?: (item: PhotoType) => void;
};

function PhotoComponentForSlider(props: PropsType) {
    //console.log("render photo for slider", props.photo.id);

    const uriSource = useMemo(() => {
        if (props.photo.inDevice) {
            return props.photo.image.path;
        } else {
            if (props.photo.image.pathCache) {
                return props.photo.image.pathCache;
            } else {
                return props.photo.image.image64;
            }
        }
    }, [props.photo]);

    const position = useSharedValue(0);
    const positionLast = useSharedValue(0);
    const positionY = useSharedValue(0);
    const positionYLast = useSharedValue(0);
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const [en, setEn] = useState(false);

    const panGesture = Gesture.Pan()
        .enabled(en)
        .onUpdate(e => {
            const newY = positionYLast.value + e.translationY / scale.value;
            positionY.value = newY;
            if (newY > (H * (scale.value - 1)) / 2 / scale.value) {
                positionY.value = (H * (scale.value - 1)) / 2 / scale.value;
            } else if (newY < (-H * (scale.value - 1)) / 2 / scale.value) {
                positionY.value = (-H * (scale.value - 1)) / 2 / scale.value;
            } else {
                positionY.value = newY;
            }

            const newX = positionLast.value + e.translationX / scale.value;
            if (newX > (W * (scale.value - 1)) / 2 / scale.value) {
                position.value = (W * (scale.value - 1)) / 2 / scale.value;
            } else if (newX < (-W * (scale.value - 1)) / 2 / scale.value) {
                position.value = (-W * (scale.value - 1)) / 2 / scale.value;
            } else {
                position.value = newX;
            }
        })
        .onEnd(e => {
            positionYLast.value = positionY.value;
            positionLast.value = position.value;
            console.log(positionLast.value, positionYLast.value);
        });

    const pinchGesture = Gesture.Pinch()
        .onUpdate(e => {
            if (savedScale.value * e.scale < 1) {
                scale.value = 1;
            } else if (savedScale.value * e.scale > 5) {
                scale.value = 5;
            } else {
                scale.value = savedScale.value * e.scale;
            }
        })
        .onEnd(() => {
            savedScale.value = scale.value;

            if (scale.value > 1) {
                runOnJS(setEn)(true);
            } else {
                runOnJS(setEn)(false);
            }
        });

    const composed = Gesture.Simultaneous(panGesture, pinchGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {scale: scale.value},
            {translateX: position.value},
            {translateY: positionY.value},
        ],
    }));
    return (
        <TouchableNativeFeedback
            activeOpacity={1}
            onPress={() => props.onPress?.(props.photo)}
            onLongPress={() => props.onLongPress?.(props.photo)}
            style={styles.touchableStyle}>
            <GestureDetector gesture={composed}>
                <Animated.View style={[styles.itemStyle, animatedStyle]}>
                    <FastImage
                        source={{uri: uriSource}}
                        resizeMode={FastImage.resizeMode.contain}
                        style={styles.imageStyle}
                    />
                </Animated.View>
            </GestureDetector>
        </TouchableNativeFeedback>
    );
}

const styles = StyleSheet.create({
    touchableStyle: {},

    itemStyle: {
        padding: 1,
        justifyContent: 'center',
        width: W,
        height: '100%',
        backgroundColor: 'white',
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        borderRadius: 0,
        backgroundColor: 'white',
    },
});

export default React.memo(PhotoComponentForSlider);
