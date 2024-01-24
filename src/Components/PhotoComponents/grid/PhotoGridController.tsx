import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleProp, ViewStyle } from 'react-native';

import { useBackgroundServiceFunctions } from '~/Context/UseContexts/useBackgroundServiceContext';
import { usePhotosFunctions } from '~/Context/UseContexts/usePhotosContext';
import { usePhotosDownloadingFunctions } from '~/Context/UseContexts/usePhotosDownloadingContext';
import { PhotoType } from '~/Helpers/types';
import { useTabNavigationContext } from '~/Navigation/TabNavigation/TabNavigationContext';

import PhotoGridComponent from './PhotoGridComponent';

type PropsType = {
  photos: Array<PhotoType>;
  style?: StyleProp<ViewStyle>;
  startIndex: number;
  contextLocation: string;
  id: string;
  onSwitchMode: (isPhotoSelected: boolean, index: number) => void;
  headerDisplayTextFunction?: (photosNb: number) => string;
};

export default function PhotoGridController({
  onSwitchMode,
  contextLocation,
  ...props
}: PropsType) {
  console.log('render grid', contextLocation);
  const {
    RefreshPhotosLocal,
    RefreshPhotosServer,
    DeletePhotosLocal,
    DeletePhotosServer,
    RequestThumbnailPhotosServer,
  } = usePhotosFunctions();

  const { SendPhotoToBackgroundServiceForUpload } = useBackgroundServiceFunctions();
  const { AddPhotosLocal } = usePhotosDownloadingFunctions();

  const getPhotoIndexRef = useRef<(photo: PhotoType) => number>();
  const [isSelecting, setIsSelecting] = useState(false);
  const [seletedIds, setSelectedIds] = useState<Map<string, PhotoType>>(new Map());
  const { hideTab, showTab } = useTabNavigationContext();

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

  getPhotoIndexRef.current = (item: PhotoType) => {
    let index = props.photos.findIndex(photo => photo.id == item.id);
    if (index < 0) {
      index = 0;
    }
    return index;
  };

  const onRenderItemPress = useCallback(
    (item: PhotoType) => {
      if (isSelecting) {
        setSelectedIds(sIds => {
          if (sIds.has(item.id)) {
            const newMap = new Map(sIds);
            newMap.delete(item.id);
            return newMap;
          } else {
            const newMap = new Map(sIds);
            newMap.set(item.id, item);
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
    (item: PhotoType) => {
      if (!isSelecting) {
        hideTab();
        setIsSelecting(true);
        const map = new Map();
        map.set(item.id, item);
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

      if (ids.size == props.photos.length) {
        return newMap;
      }

      props.photos.forEach(photo => {
        newMap.set(photo.id, photo);
      });

      return newMap;
    });
  }, [props.photos]);

  let correctStartIndex = Math.floor(props.startIndex / 3);

  if (props.startIndex >= props.photos.length) {
    correctStartIndex = Math.floor((props.photos.length - 1) / 3);
  }

  if (correctStartIndex < 0) {
    correctStartIndex = 0;
  }

  const onRefresh = useCallback(() => {
    if (contextLocation == 'local') {
      RefreshPhotosLocal().catch(e => console.log('Error : onRefreshLocal', e));
    } else if (contextLocation == 'server') {
      RefreshPhotosServer().catch(e => console.log('Error : onRefreshServer', e));
    }
  }, [RefreshPhotosLocal, RefreshPhotosServer, contextLocation]);

  const onAddLocal = useCallback(() => {
    setIsSelecting(false);
    showTab();
    AddPhotosLocal?.(Array.from(seletedIds.values())).catch(e =>
      console.log('Error : addPhotosLocal', e),
    );
  }, [AddPhotosLocal, seletedIds, showTab]);

  const onAddServer = useCallback(() => {
    setIsSelecting(false);
    showTab();
    SendPhotoToBackgroundServiceForUpload?.(Array.from(seletedIds.values())).catch(e =>
      console.log('Error : addPhotosServer', e),
    );
  }, [SendPhotoToBackgroundServiceForUpload, seletedIds, showTab]);

  const onDeleteLocal = useCallback(() => {
    setIsSelecting(false);
    showTab();
    const photosToDelete = Array.from(seletedIds.values());
    if (contextLocation == 'server') {
      RequestThumbnailPhotosServer(photosToDelete).catch(e =>
        console.log('Error : RequestCroppedPhotosServer', e),
      );
    }
    DeletePhotosLocal?.(photosToDelete).catch(e =>
      console.log('Error : deletePhotosLocal', e),
    );
  }, [DeletePhotosLocal, RequestThumbnailPhotosServer, contextLocation, seletedIds, showTab]);

  const onDeleteServer = useCallback(() => {
    setIsSelecting(false);
    showTab();
    DeletePhotosServer?.(Array.from(seletedIds.values())).catch(e =>
      console.log('Error : deletePhotosServer', e),
    );
  }, [DeletePhotosServer, seletedIds, showTab]);

  return (
    <PhotoGridComponent
      photos={props.photos}
      style={props.style}
      onPressPhoto={onRenderItemPress}
      onLongPressPhoto={onRenderItemLongPress}
      initialScrollIndex={correctStartIndex}
      onRefresh={onRefresh}
      isSelecting={isSelecting}
      selectedIds={seletedIds}
      onAddLocal={onAddLocal}
      onAddServer={onAddServer}
      onDeleteLocal={onDeleteLocal}
      onDeleteServer={onDeleteServer}
      onSelectAll={onSelectAll}
      onBackButton={onBackButton}
      contextLocation={contextLocation}
    />
  );
}
