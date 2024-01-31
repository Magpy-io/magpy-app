import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/PhotosFunctions';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useTabNavigationContext } from '~/Navigation/TabNavigation/TabNavigationContext';

import PhotoGridComponent from './PhotoGridComponent';
import PhotoGridSelectView from './PhotoGridSelectView';

type PropsType = {
  scrollPosition: number;
  isSlidingPhotos: boolean;
  onSwitchMode: (isPhotoSelected: boolean, index: number) => void;
};

function PhotoGridController({ onSwitchMode, scrollPosition, isSlidingPhotos }: PropsType) {
  console.log('render grid');

  const photos = useAppSelector(state => state.photos.photosGallery);

  const photosRef = useRef<PhotoGalleryType[]>(photos);
  photosRef.current = photos;

  const [isSelecting, setIsSelecting] = useState(false);
  const [seletedKeys, setSelectedKeys] = useState<Map<string, PhotoGalleryType>>(new Map());

  const { hideTab, showTab } = useTabNavigationContext();
  const { RefreshAllPhotos } = usePhotosFunctionsStore();

  useEffect(() => {
    if (isSelecting) {
      const backAction = () => {
        setIsSelecting(false);
        showTab();
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }
  }, [isSelecting, showTab]);

  useEffect(() => {
    if (!isSlidingPhotos) {
      showTab();
    }
  }, [isSlidingPhotos, showTab]);

  const findPhotoIndex = useCallback((item: PhotoGalleryType) => {
    let index = photosRef.current.findIndex(photo => photo.key == item.key);
    if (index < 0) {
      index = 0;
    }
    return index;
  }, []);

  const onRenderItemPress = useCallback(
    (item: PhotoGalleryType) => {
      if (isSelecting) {
        setSelectedKeys(sKeys => {
          if (sKeys.has(item.key)) {
            const newMap = new Map(sKeys);
            newMap.delete(item.key);
            return newMap;
          } else {
            const newMap = new Map(sKeys);
            newMap.set(item.key, item);
            return newMap;
          }
        });
      } else {
        onSwitchMode(true, findPhotoIndex(item) || 0);
      }
    },
    [isSelecting, onSwitchMode, findPhotoIndex],
  );

  const onRenderItemLongPress = useCallback(
    (item: PhotoGalleryType) => {
      if (!isSelecting) {
        hideTab();
        setIsSelecting(true);
        const map = new Map();
        map.set(item.key, item);
        setSelectedKeys(map);
      }
    },
    [hideTab, isSelecting],
  );

  const onBackButton = useCallback(() => {
    setIsSelecting(false);
    showTab();
  }, [setIsSelecting, showTab]);

  const onSelectAll = useCallback(() => {
    setSelectedKeys(ids => {
      const newMap = new Map();

      if (ids.size == photos.length) {
        return newMap;
      }

      photos.forEach(photo => {
        newMap.set(photo.key, photo);
      });

      return newMap;
    });
  }, [photos]);

  const onRefresh = useCallback(() => {
    RefreshAllPhotos(3000, 3000).catch(console.log);
  }, [RefreshAllPhotos]);

  return (
    <View>
      <PhotoGridComponent
        photos={photos}
        onPressPhoto={onRenderItemPress}
        onLongPressPhoto={onRenderItemLongPress}
        scrollPosition={scrollPosition}
        onRefresh={onRefresh}
        isSelecting={isSelecting}
        selectedIds={seletedKeys}
      />
      <PhotoGridSelectView
        onBackButton={onBackButton}
        onSelectAll={onSelectAll}
        isSelecting={isSelecting}
        selectedIds={seletedKeys}
      />
    </View>
  );
}

export default React.memo(PhotoGridController);
