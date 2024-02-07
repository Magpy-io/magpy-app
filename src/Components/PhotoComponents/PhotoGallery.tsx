import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotoServerType,
} from '~/Context/ReduxStore/Slices/Photos';
import { TabBarPadding } from '~/Navigation/TabNavigation/TabBar';
import { appColors } from '~/styles/colors';
import { spacing } from '~/styles/spacing';

import { TuneIcon } from '../CommonComponents/Icons';
import { PhotoGalleryHeader } from './PhotoGalleryHeader';
import PhotoGridController from './grid/PhotoGridController';
import PhotoSlider from './slider/PhotoSliderController';

type PhotoGalleryPropsType = {
  photos: Array<PhotoGalleryType>;
  localPhotos: {
    [key: string]: PhotoLocalType;
  };
  serverPhotos: {
    [key: string]: PhotoServerType;
  };
  title?: string;
  showBackButton?: boolean;
  onPressBack?: () => void;
  isInTabScreen?: boolean;
};

export default function PhotoGallery(props: PhotoGalleryPropsType) {
  const [switchingState, setSwitchingState] = useState({
    isSlidingPhotos: false,
    currentPhotoIndex: 0,
  });

  const { isSlidingPhotos, currentPhotoIndex } = switchingState;

  const onSwitchMode = useCallback((isSlidingPhotos: boolean, index: number) => {
    setSwitchingState({
      isSlidingPhotos: isSlidingPhotos,
      currentPhotoIndex: index,
    });
  }, []);

  const displaySlider = isSlidingPhotos ? 'flex' : 'none';
  const displayGrid = isSlidingPhotos ? 'none' : 'flex';
  const insets = useSafeAreaInsets();

  const filterButton = () => (
    <TuneIcon onPress={() => {}} iconStyle={{ padding: spacing.spacing_m }} />
  );
  return (
    <View style={styles.viewStyle}>
      <View
        style={[
          styles.viewStyle,
          { display: displayGrid },
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}>
        <PhotoGalleryHeader
          title={props.title}
          iconRight={filterButton}
          showBackButton={props.showBackButton}
          onPressBack={props.onPressBack}
        />
        <PhotoGridController
          photos={props.photos}
          localPhotos={props.localPhotos}
          serverPhotos={props.serverPhotos}
          isSlidingPhotos={isSlidingPhotos}
          currentPhotoIndex={currentPhotoIndex}
          onSwitchMode={onSwitchMode}
        />
        {(props.isInTabScreen ?? false) && <TabBarPadding />}
      </View>
      <View style={[styles.viewStyle, { display: displaySlider }]}>
        <PhotoSlider
          photos={props.photos}
          isSlidingPhotos={isSlidingPhotos}
          currentPhotoIndex={currentPhotoIndex}
          onSwitchMode={onSwitchMode}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    backgroundColor: appColors.BACKGROUND,
  },
});
