import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { FullScreenModule } from '~/NativeModules/FullScreenModule';
import { NativeEventEmitterWrapper } from '~/NativeModules/NativeModulesEventNames';
import { useTabNavigationContext } from '~/Navigation/TabNavigation/TabNavigationContext';

import ToolBarPhotos from '../common/ToolBarPhotos';
import { useCustomBackPress } from '../common/useCustomBackPress';
import PhotoSliderComponent, { PhotoSliderComponentRefType } from './PhotoSliderComponent';
import PhotoSliderHeader from './PhotoSliderHeader';

type PropsType = {
  photos: Array<PhotoGalleryType>;
  isSlidingPhotos: boolean;
  onSwitchMode: (isPhotoSelected: boolean, index: number) => void;
};

const PhotoSliderController = React.forwardRef<PhotoSliderComponentRefType, PropsType>(
  ({ photos, onSwitchMode, isSlidingPhotos }: PropsType, ref) => {
    const [flatListCurrentIndex, setFlatListCurrentIndex] = useState(0);
    const flatListCurrentIndexRef = useRef<number>(0);

    const [isFullScreen, setIsFullScreen] = useState(false);

    const { hideTab } = useTabNavigationContext();

    const currentPhoto = photos[flatListCurrentIndex] as PhotoGalleryType | undefined;

    useEffect(() => {
      if (isSlidingPhotos && photos.length == 0) {
        onSwitchMode(false, 0);
      }
    }, [isSlidingPhotos, photos.length, onSwitchMode]);

    useEffect(() => {
      const emitter = new NativeEventEmitterWrapper();
      const subscription = emitter.subscribeOnFullScreenChanged(({ isFullScreen }) => {
        setIsFullScreen(isFullScreen);
      });

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
          await FullScreenModule.disableFullScreen();
        } else {
          await FullScreenModule.enableFullScreen();
        }
        setIsFullScreen(f => !f);
      };

      onPressAsync().catch(console.log);
    }, [isFullScreen]);

    const backPressAction = useCallback(() => {
      onSwitchMode(false, flatListCurrentIndexRef.current);
    }, [onSwitchMode]);

    useCustomBackPress(backPressAction, isSlidingPhotos);

    const onStatusBarBackButton = useCallback(() => {
      onSwitchMode(false, flatListCurrentIndexRef.current);
    }, [onSwitchMode]);

    return (
      <View style={[styles.mainViewStyle]}>
        <PhotoSliderComponent
          ref={ref}
          photos={photos}
          onIndexChanged={onCurrentIndexChanged}
          onPhotoClick={onPressPhoto}
          isFullScreen={isFullScreen}
        />

        {!isFullScreen && currentPhoto && (
          <PhotoSliderHeader photo={currentPhoto} onBackButton={onStatusBarBackButton} />
        )}

        {!isFullScreen && (
          <ToolBarPhotos selectedGalleryPhotos={currentPhoto ? [currentPhoto] : []} />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  mainViewStyle: {
    height: '100%',
    width: '100%',
  },
});

PhotoSliderController.displayName = 'PhotoSliderController';

export default React.memo(PhotoSliderController);
