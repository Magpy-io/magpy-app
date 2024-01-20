import React, { useCallback, useRef, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { useMainContext } from '~/Context/ContextProvider';
import { PhotoType } from '~/Helpers/types';

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
    onRefreshLocal,
    onRefreshServer,
    addPhotosLocal,
    deletePhotosServer,
    deletePhotosLocal,
    addPhotosServer,
    RequestCroppedPhotosServer,
  } = useMainContext();

  const getPhotoIndexRef = useRef<(photo: PhotoType) => number>();
  const [isSelecting, setIsSelecting] = useState(false);
  const [seletedIds, setSelectedIds] = useState<Map<string, PhotoType>>(new Map());

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
        onSwitchMode(true, getPhotoIndexRef.current?.(item) || 0);
      }
    },
    [onSwitchMode, isSelecting],
  );

  const onRenderItemLongPress = useCallback(
    (item: PhotoType) => {
      if (!isSelecting) {
        setIsSelecting(true);
        const map = new Map();
        map.set(item.id, item);
        setSelectedIds(map);
      }
    },
    [isSelecting],
  );

  const onBackButton = useCallback(() => setIsSelecting(false), [setIsSelecting]);

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
      onRefreshLocal().catch(e => console.log('Error : onRefreshLocal', e));
    } else if (contextLocation == 'server') {
      onRefreshServer().catch(e => console.log('Error : onRefreshServer', e));
    }
  }, [contextLocation, onRefreshLocal, onRefreshServer]);

  const onAddLocal = useCallback(() => {
    setIsSelecting(false);
    addPhotosLocal?.(Array.from(seletedIds.values())).catch(e =>
      console.log('Error : addPhotosLocal', e),
    );
  }, [addPhotosLocal, seletedIds]);

  const onAddServer = useCallback(() => {
    setIsSelecting(false);
    addPhotosServer?.(Array.from(seletedIds.values())).catch(e =>
      console.log('Error : addPhotosServer', e),
    );
  }, [addPhotosServer, seletedIds]);

  const onDeleteLocal = useCallback(() => {
    setIsSelecting(false);
    const photosToDelete = Array.from(seletedIds.values());
    if (contextLocation == 'server') {
      RequestCroppedPhotosServer(photosToDelete).catch(e =>
        console.log('Error : RequestCroppedPhotosServer', e),
      );
    }
    deletePhotosLocal?.(photosToDelete).catch(e =>
      console.log('Error : deletePhotosLocal', e),
    );
  }, [RequestCroppedPhotosServer, contextLocation, deletePhotosLocal, seletedIds]);

  const onDeleteServer = useCallback(() => {
    setIsSelecting(false);
    deletePhotosServer?.(Array.from(seletedIds.values())).catch(e =>
      console.log('Error : deletePhotosServer', e),
    );
  }, [deletePhotosServer, seletedIds]);

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
