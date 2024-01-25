import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleProp, ViewStyle } from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/PhotosFunctions';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useTabNavigationContext } from '~/Navigation/TabNavigation/TabNavigationContext';

import PhotoGridComponent from './PhotoGridComponent';

type PropsType = {
  style?: StyleProp<ViewStyle>;
  startIndex: number;
  id: string;
  onSwitchMode: (isPhotoSelected: boolean, index: number) => void;
};

export default function PhotoGridController({ onSwitchMode, ...props }: PropsType) {
  console.log('render grid');

  const photos = useAppSelector(state => state.photos.photosGallery);

  const getPhotoIndexRef = useRef<(photo: PhotoGalleryType) => number>();
  const [isSelecting, setIsSelecting] = useState(false);
  const [seletedIds, setSelectedIds] = useState<Map<string, PhotoGalleryType>>(new Map());
  const { hideTab, showTab } = useTabNavigationContext();

  const { RefreshLocalPhotos } = usePhotosFunctionsStore();

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

  getPhotoIndexRef.current = (item: PhotoGalleryType) => {
    let index = photos.findIndex(photo => photo.uri == item.uri);
    if (index < 0) {
      index = 0;
    }
    return index;
  };

  const onRenderItemPress = useCallback(
    (item: PhotoGalleryType) => {
      if (isSelecting) {
        setSelectedIds(sIds => {
          if (sIds.has(item.uri)) {
            const newMap = new Map(sIds);
            newMap.delete(item.uri);
            return newMap;
          } else {
            const newMap = new Map(sIds);
            newMap.set(item.uri, item);
            return newMap;
          }
        });
      } else {
        hideTab();
        onSwitchMode(true, getPhotoIndexRef.current?.(item) || 0);
      }
    },
    [isSelecting, hideTab, onSwitchMode],
  );

  const onRenderItemLongPress = useCallback(
    (item: PhotoGalleryType) => {
      if (!isSelecting) {
        hideTab();
        setIsSelecting(true);
        const map = new Map();
        map.set(item.uri, item);
        setSelectedIds(map);
      }
    },
    [hideTab, isSelecting],
  );

  const onBackButton = useCallback(() => {
    setIsSelecting(false);
    showTab();
  }, [setIsSelecting, showTab]);

  const onSelectAll = useCallback(() => {
    setSelectedIds(ids => {
      const newMap = new Map();

      if (ids.size == photos.length) {
        return newMap;
      }

      photos.forEach(photo => {
        newMap.set(photo.uri, photo);
      });

      return newMap;
    });
  }, [photos]);

  let correctStartIndex = Math.floor(props.startIndex / 3);

  if (props.startIndex >= photos.length) {
    correctStartIndex = Math.floor((photos.length - 1) / 3);
  }

  if (correctStartIndex < 0) {
    correctStartIndex = 0;
  }

  const onRefresh = useCallback(() => {
    RefreshLocalPhotos().catch(e => console.log('Error : onRefreshLocal', e));
  }, [RefreshLocalPhotos]);

  return (
    <PhotoGridComponent
      photos={photos}
      style={props.style}
      onPressPhoto={onRenderItemPress}
      onLongPressPhoto={onRenderItemLongPress}
      initialScrollIndex={correctStartIndex}
      onRefresh={onRefresh}
      isSelecting={isSelecting}
      selectedIds={seletedIds}
      onSelectAll={onSelectAll}
      onBackButton={onBackButton}
    />
  );
}
