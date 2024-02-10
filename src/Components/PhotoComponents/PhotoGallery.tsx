import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotoServerType,
} from '~/Context/ReduxStore/Slices/Photos';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';

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
  const styles = useStyles(makeStyles);

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
  const Header = () => (
    <PhotoGalleryHeader
      title={props.title}
      iconRight={filterButton}
      showBackButton={props.showBackButton}
      onPressBack={props.onPressBack}
    />
  );
  return (
    <View style={styles.viewStyle}>
      <View
        style={[
          styles.viewStyle,
          { display: displayGrid },
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}>
        <PhotoGridController
          header={Header}
          photos={props.photos}
          localPhotos={props.localPhotos}
          serverPhotos={props.serverPhotos}
          isSlidingPhotos={isSlidingPhotos}
          currentPhotoIndex={currentPhotoIndex}
          onSwitchMode={onSwitchMode}
          isInTabScreen={props.isInTabScreen}
        />
      </View>
      <View
        style={[
          styles.viewStyle,
          { display: displaySlider },
          { paddingBottom: insets.bottom },
        ]}>
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

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    viewStyle: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
    },
  });
