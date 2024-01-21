import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { NativeEventEmitter, NativeModules } from 'react-native';

import { usePhotosFunctions } from '~/Context/PhotosContextHooks';
import { useTabNavigationContext } from '~/Context/TabNavigationContext';
import { useBackgroundService } from '~/Context/useBackgroundService';
import { usePhotosDownloading } from '~/Context/usePhotosDownloading';
import { PhotoType } from '~/Helpers/types';

import PhotoDetailsModal from './PhotoDetailsModal';
import PhotoSliderComponent from './PhotoSliderComponent';
import StatusBarComponent from './StatusBarComponent';
import ToolBar from './ToolBar';

const { MainModule } = NativeModules;

type PropsType = {
  photos: Array<PhotoType>;
  style?: StyleProp<ViewStyle>;
  startIndex: number;
  contextLocation: string;
  id: string;
  isSliding: boolean;
  onSwitchMode: (isPhotoSelected: boolean, index: number) => void;
};

export default function PhotoSlider({
  photos,
  contextLocation,
  onSwitchMode,
  ...props
}: PropsType) {
  console.log('render slider', contextLocation);

  const {
    RequestCompressedPhotoServer,
    DeletePhotosLocal,
    DeletePhotosServer,
    RequestThumbnailPhotosServer,
  } = usePhotosFunctions();

  const { SendPhotoToBackgroundServiceForUpload } = useBackgroundService();
  const { AddPhotosLocal } = usePhotosDownloading();

  const flatListCurrentIndexRef = useRef<number>(props.startIndex);
  const [flatListCurrentIndex, setFlatListCurrentIndex] = useState(props.startIndex);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const validFlatListCurrentIndex = photos.length != 0 && flatListCurrentIndex < photos.length;
  const { showTab } = useTabNavigationContext();

  useEffect(() => {
    if (
      validFlatListCurrentIndex &&
      !photos[flatListCurrentIndex].inDevice &&
      contextLocation == 'server'
    ) {
      RequestCompressedPhotoServer(photos[flatListCurrentIndex]).catch(e =>
        console.log('Error : RequestFullPhotoServer', e),
      );
    }
  }, [
    photos,
    contextLocation,
    flatListCurrentIndex,
    validFlatListCurrentIndex,
    RequestCompressedPhotoServer,
  ]);

  const onCurrentIndexChanged = useCallback((index: number) => {
    flatListCurrentIndexRef.current = index;
    setFlatListCurrentIndex(index);
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (props.isSliding) {
        onSwitchMode(false, flatListCurrentIndexRef.current);
        showTab();
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
  }, [onSwitchMode, props.isSliding, showTab]);

  useEffect(() => {
    if (photos.length == 0) {
      onSwitchMode(false, 0);
    }
  }, [photos.length, onSwitchMode]);

  useEffect(() => {
    const emitter = new NativeEventEmitter();
    const subscription = emitter.addListener(
      'FullScreenChanged',
      (param: { isFullScreen: boolean }) => {
        console.log('fullscreenChanged');
        setIsFullScreen(param.isFullScreen);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const onAddLocal = () => {
    AddPhotosLocal?.([photos[flatListCurrentIndex]]).catch(e =>
      console.log('Error : addPhotosLocal', e),
    );
  };

  const onAddServer = () => {
    SendPhotoToBackgroundServiceForUpload?.([photos[flatListCurrentIndex]]).catch(e =>
      console.log('Error : addPhotosServer', e),
    );
  };

  const onDeleteLocal = () => {
    if (contextLocation == 'server') {
      RequestThumbnailPhotosServer([photos[flatListCurrentIndex]]).catch(e =>
        console.log('Error : RequestCroppedPhotosServer', e),
      );
    }
    DeletePhotosLocal?.([photos[flatListCurrentIndex]]).catch(e =>
      console.log('Error : deletePhotosLocal', e),
    );
  };

  const onDeleteServer = () => {
    DeletePhotosServer?.([photos[flatListCurrentIndex]]).catch(e => {
      console.log('Error: deletePhotosServer', e);
    });
  };

  const onPressPhoto = async () => {
    if (isFullScreen) {
      await MainModule.disableFullScreen();
    } else {
      await MainModule.enableFullScreen();
    }
    setIsFullScreen(f => !f);
  };

  const onStatusBarBackButton = () => {
    onSwitchMode(false, flatListCurrentIndex);
    showTab();
  };

  return (
    <View style={[styles.mainViewStyle, props.style]}>
      <PhotoSliderComponent
        photos={photos}
        startIndex={props.startIndex}
        onIndexChanged={onCurrentIndexChanged}
        //onEndReached={}
        onPhotoClick={() => {
          onPressPhoto().catch(console.log);
        }}
      />

      {validFlatListCurrentIndex && !isFullScreen && (
        <StatusBarComponent
          inDevice={photos[flatListCurrentIndex].inDevice}
          inServer={photos[flatListCurrentIndex].inServer}
          isLoading={photos[flatListCurrentIndex].isLoading}
          loadingPercentage={photos[flatListCurrentIndex].loadingPercentage}
          onBackButton={onStatusBarBackButton}
        />
      )}

      {validFlatListCurrentIndex && !isFullScreen && (
        <>
          <ToolBar
            inDevice={photos[flatListCurrentIndex].inDevice}
            inServer={photos[flatListCurrentIndex].inServer}
            onAddLocal={onAddLocal}
            onAddServer={onAddServer}
            onDeleteLocal={onDeleteLocal}
            onDeleteServer={onDeleteServer}
            onDetails={() => {
              setDetailsModalVisible(true);
              console.log('details');
            }}
          />

          <PhotoDetailsModal
            modalVisible={detailsModalVisible}
            handleModal={() => setDetailsModalVisible(!detailsModalVisible)}
            photo={photos[flatListCurrentIndex]}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewStyle: {
    height: '100%',
    width: '100%',
  },
});
