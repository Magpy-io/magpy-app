import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { NativeEventEmitter, NativeModules } from 'react-native';

import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useTabNavigationContext } from '~/Navigation/TabNavigation/TabNavigationContext';

import PhotoSliderComponent from './PhotoSliderComponent';
import StatusBarComponent from './StatusBarComponent';
import ToolBar from './ToolBar';

const { MainModule } = NativeModules;

type PropsType = {
  style?: StyleProp<ViewStyle>;
  startIndex: number;
  id: string;
  isSliding: boolean;
  onSwitchMode: (isPhotoSelected: boolean, index: number) => void;
};

export default function PhotoSlider({ onSwitchMode, ...props }: PropsType) {
  console.log('render slider');

  const photos = useAppSelector(state => state.photos.photosGallery);

  const flatListCurrentIndexRef = useRef<number>(props.startIndex);
  const [flatListCurrentIndex, setFlatListCurrentIndex] = useState(props.startIndex);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const validFlatListCurrentIndex = photos.length != 0 && flatListCurrentIndex < photos.length;
  const { showTab } = useTabNavigationContext();

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
        isFullScreen={isFullScreen}
      />

      {validFlatListCurrentIndex && !isFullScreen && (
        <StatusBarComponent
          inDevice={true}
          inServer={false}
          isLoading={false}
          loadingPercentage={0}
          title={'formatDate(photos[flatListCurrentIndex].created)'}
          onBackButton={onStatusBarBackButton}
        />
      )}

      {validFlatListCurrentIndex && !isFullScreen && (
        <>
          <ToolBar
            inDevice={true}
            inServer={false}
            onDetails={() => {
              setDetailsModalVisible(true);
              console.log('details');
            }}
          />

          {/* <PhotoDetailsModal
            modalVisible={detailsModalVisible}
            handleModal={() => setDetailsModalVisible(!detailsModalVisible)}
            photo={photos[flatListCurrentIndex]}
          /> */}
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
