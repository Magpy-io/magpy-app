import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { FullScreenEvents, FullScreenModule } from '~/NativeModules/FullScreenModule';

import { useCustomBackPress } from '../../../Hooks/useCustomBackPress';
import ToolBarPhotos from '../common/ToolBarPhotos';
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

    const currentPhoto = photos[flatListCurrentIndex] as PhotoGalleryType | undefined;

    useEffect(() => {
      if (isSlidingPhotos && photos.length == 0) {
        onSwitchMode(false, 0);
      }
    }, [isSlidingPhotos, photos.length, onSwitchMode]);

    useEffect(() => {
      const subscription = FullScreenEvents.subscribeOnFullScreenChanged(
        ({ isFullScreen }) => {
          setIsFullScreen(isFullScreen);
        },
      );

      return () => {
        subscription.remove();
      };
    }, []);

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

    const selectedGalleryPhotos = useMemo(() => {
      return currentPhoto ? [currentPhoto] : [];
    }, [currentPhoto]);

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

        {!isFullScreen && <ToolBarPhotos selectedGalleryPhotos={selectedGalleryPhotos} />}
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
