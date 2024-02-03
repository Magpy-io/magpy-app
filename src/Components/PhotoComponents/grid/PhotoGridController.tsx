import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';

import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotoServerType,
} from '~/Context/ReduxStore/Slices/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/PhotosFunctions';
import { useTabNavigationContext } from '~/Navigation/TabNavigation/TabNavigationContext';

import PhotoGridComponent from './PhotoGridComponent';
import SelectionBar from './SelectionBar';
import ToolBarPhotos from './ToolBarPhotos';

type PropsType = {
  photos: Array<PhotoGalleryType>;
  localPhotos: {
    [key: string]: PhotoLocalType;
  };
  serverPhotos: {
    [key: string]: PhotoServerType;
  };
  currentPhotoIndex: number;
  isSlidingPhotos: boolean;
  onSwitchMode: (isPhotoSelected: boolean, index: number) => void;
};

function PhotoGridController({
  photos,
  onSwitchMode,
  currentPhotoIndex,
  isSlidingPhotos,
  localPhotos,
  serverPhotos,
}: PropsType) {
  //console.log('render grid');

  const photosRef = useRef<PhotoGalleryType[]>(photos);
  photosRef.current = photos;

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

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
            const newSet = new Set(sKeys);
            newSet.delete(item.key);
            return newSet;
          } else {
            const newSet = new Set(sKeys);
            newSet.add(item.key);
            return newSet;
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
        const set = new Set<string>();
        set.add(item.key);
        setSelectedKeys(set);
      }
    },
    [hideTab, isSelecting],
  );

  const onBackButton = useCallback(() => {
    setIsSelecting(false);
    showTab();
  }, [setIsSelecting, showTab]);

  const onSelectAll = useCallback(() => {
    setSelectedKeys(sKeys => {
      if (sKeys.size == photos.length) {
        return new Set<string>();
      }

      return new Set(photos.map(photo => photo.key));
    });
  }, [photos]);

  const onRefresh = useCallback(() => {
    RefreshAllPhotos(30, 30).catch(console.log);
  }, [RefreshAllPhotos]);

  return (
    <View>
      <PhotoGridComponent
        photos={photos}
        localPhotos={localPhotos}
        serverPhotos={serverPhotos}
        onPressPhoto={onRenderItemPress}
        onLongPressPhoto={onRenderItemLongPress}
        currentPhotoIndex={currentPhotoIndex}
        onRefresh={onRefresh}
        isSelecting={isSelecting}
        selectedKeys={selectedKeys}
      />

      {isSelecting && (
        <SelectionBar
          selectedNb={selectedKeys.size}
          onCancelButton={onBackButton}
          onSelectAllButton={onSelectAll}
        />
      )}

      {isSelecting && <ToolBarPhotos selectedKeys={selectedKeys} />}
    </View>
  );
}

export default React.memo(PhotoGridController);
