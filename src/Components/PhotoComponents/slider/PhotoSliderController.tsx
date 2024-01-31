import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { NativeEventEmitter, NativeModules } from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { NativeEventsNames } from '~/NativeModules/NativeModulesEventNames';
import { useTabNavigationContext } from '~/Navigation/TabNavigation/TabNavigationContext';

import PhotoSliderComponent from './PhotoSliderComponent';
import StatusBarComponent from './StatusBarComponent';
import ToolBar from './ToolBar';

const { MainModule } = NativeModules;

type PropsType = {
  photos: Array<PhotoGalleryType>;
  scrollPosition: number;
  isSlidingPhotos: boolean;
  onSwitchMode: (isPhotoSelected: boolean, index: number) => void;
};

function PhotoSlider({ photos, onSwitchMode, isSlidingPhotos, scrollPosition }: PropsType) {
  console.log('render slider');

  const [flatListCurrentIndex, setFlatListCurrentIndex] = useState(scrollPosition);
  const flatListCurrentIndexRef = useRef<number>(flatListCurrentIndex);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const { hideTab } = useTabNavigationContext();

  useEffect(() => {
    if (photos.length == 0) {
      onSwitchMode(false, 0);
    }
  }, [photos.length, onSwitchMode]);

  useEffect(() => {
    const backAction = () => {
      if (isSlidingPhotos) {
        onSwitchMode(false, flatListCurrentIndexRef.current);
        backHandler.remove();
        return true;
      } else {
        return false;
      }
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      return backHandler.remove();
    };
  }, [onSwitchMode, isSlidingPhotos]);

  useEffect(() => {
    const emitter = new NativeEventEmitter();
    const subscription = emitter.addListener(
      NativeEventsNames.FullScreenChanged,
      (param: { isFullScreen: boolean }) => {
        console.log('fullscreenChanged');
        setIsFullScreen(param.isFullScreen);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isSlidingPhotos) {
      hideTab();
    }
  }, [hideTab, isSlidingPhotos]);

  const onCurrentIndexChanged = useCallback((index: number) => {
    flatListCurrentIndexRef.current = index;
    setFlatListCurrentIndex(index);
  }, []);

  const onPressPhoto = useCallback(() => {
    const onPressAsync = async () => {
      if (isFullScreen) {
        await MainModule.disableFullScreen();
      } else {
        await MainModule.enableFullScreen();
      }
      setIsFullScreen(f => !f);
    };

    onPressAsync().catch(console.log);
  }, [isFullScreen]);

  const onStatusBarBackButton = useCallback(() => {
    onSwitchMode(false, flatListCurrentIndexRef.current);
  }, [onSwitchMode]);

  return (
    <View style={[styles.mainViewStyle]}>
      <PhotoSliderComponent
        photos={photos}
        scrollPosition={scrollPosition}
        onIndexChanged={onCurrentIndexChanged}
        onPhotoClick={onPressPhoto}
        isFullScreen={isFullScreen}
      />

      {!isFullScreen && <StatusBarComponent onBackButton={onStatusBarBackButton} />}

      {!isFullScreen && <ToolBar />}
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewStyle: {
    height: '100%',
    width: '100%',
  },
});

export default React.memo(PhotoSlider);
