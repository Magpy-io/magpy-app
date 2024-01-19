import {StyleSheet, View, StyleProp, ViewStyle, Modal} from 'react-native';

import {useCallback, useState, useEffect} from 'react';
import PhotoGrid from '~/Components/PhotoGrid';
import PhotoSlider from '~/Components/PhotoSlider';
import {PhotoType} from '~/Helpers/types';
import {useMainContext} from '~/Components/ContextProvider';
import {Text} from 'react-native-elements';

type PropsType = {
    style?: StyleProp<ViewStyle>;
    photos: PhotoType[];
    contextLocation: string;
    gridHeaderTextFunction?: (photosNb: number) => string;
};

export default function PhotoGallery(props: PropsType) {
    console.log('render gallery', props.contextLocation);

    const context = useMainContext();

    const [switchingState, setSwitchingState] = useState({
        isPhotoSelected: false,
        startIndexWhenSwitching: 0,
    });

    const onSwitchMode = useCallback((isPhotoSelected: boolean, index: number) => {
        setSwitchingState(s => {
            if (s.isPhotoSelected != isPhotoSelected || s.startIndexWhenSwitching != index) {
                return {
                    isPhotoSelected: isPhotoSelected,
                    startIndexWhenSwitching: index,
                };
            } else {
                return s;
            }
        });
    }, []);

    return (
        <View style={[styles.viewStyle, props.style]}>
            <PhotoGrid
                key={'photo_grid_' + props.contextLocation}
                id={'photo_grid_' + props.contextLocation}
                contextLocation={props.contextLocation}
                style={{}}
                photos={props.photos}
                startIndex={switchingState.startIndexWhenSwitching}
                onSwitchMode={onSwitchMode}
                headerDisplayTextFunction={props.gridHeaderTextFunction}
            />
            <PhotoSlider
                visible={switchingState.isPhotoSelected}
                key={'photo_slider_' + props.contextLocation}
                id={'photo_slider_' + props.contextLocation}
                contextLocation={props.contextLocation}
                isSliding={switchingState.isPhotoSelected}
                style={{}}
                photos={props.photos}
                startIndex={switchingState.startIndexWhenSwitching}
                onSwitchMode={onSwitchMode}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    viewStyle: {},
});
