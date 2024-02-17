import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Pressable, View } from 'react-native';

import { TuneIcon } from '~/Components/CommonComponents/Icons';
import MenuModal from '~/Components/CommonComponents/MenuModal';
import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotoServerType,
} from '~/Context/ReduxStore/Slices/Photos/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/Photos/PhotosFunctions';
import { TabBarPadding } from '~/Navigation/TabNavigation/TabBar';
import { useTabNavigationContext } from '~/Navigation/TabNavigation/TabNavigationContext';
import { spacing } from '~/Styles/spacing';

import { PhotoGalleryHeader } from '../PhotoGalleryHeader';
import ToolBarPhotos from '../common/ToolBarPhotos';
import PhotoGridComponent from './PhotoGridComponent';
import PhotoMenu from './PhotoMenu';
import SelectionBar from './SelectionBar';

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
  isInTabScreen?: boolean;
  title?: string;
  showBackButton?: boolean;
  onPressBack?: () => void;
};

function PhotoGridController({
  photos,
  onSwitchMode,
  currentPhotoIndex,
  isSlidingPhotos,
  localPhotos,
  serverPhotos,
  isInTabScreen,
  title,
  showBackButton,
  onPressBack,
}: PropsType) {
  console.log('render grid');

  const photosRef = useRef<PhotoGalleryType[]>(photos);
  photosRef.current = photos;

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [menuModalVisible, setMenuModalVisible] = useState(false);

  const showMenuModal = useCallback(() => setMenuModalVisible(true), []);
  const handleMenuModal = useCallback(() => setMenuModalVisible(prev => !prev), []);

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

  const onSelectPhotoGroup = useCallback((items: PhotoGalleryType[]) => {
    setSelectedKeys(sKeys => {
      const newSet = new Set(sKeys);

      const isAllGroupSelected = !items.find(item => !sKeys.has(item.key));

      if (isAllGroupSelected) {
        items.forEach(item => {
          newSet.delete(item.key);
        });
      } else {
        items.forEach(item => {
          if (!sKeys.has(item.key)) {
            newSet.add(item.key);
          }
        });
      }
      return newSet;
    });
  }, []);

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
    RefreshAllPhotos(3000, 3000).catch(console.log);
  }, [RefreshAllPhotos]);

  const menuButton = () => (
    <Pressable onPress={showMenuModal}>
      <TuneIcon iconStyle={{ padding: spacing.spacing_m }} />
    </Pressable>
  );
  const Header = () => (
    <PhotoGalleryHeader
      title={title}
      iconRight={menuButton}
      showBackButton={showBackButton}
      onPressBack={onPressBack}
    />
  );
  return (
    <View style={{ flex: 1 }}>
      <Header />
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
        onSelectPhotoGroup={onSelectPhotoGroup}
      />

      {isSelecting && (
        <SelectionBar
          selectedNb={selectedKeys.size}
          onCancelButton={onBackButton}
          onSelectAllButton={onSelectAll}
        />
      )}

      {isSelecting && <ToolBarPhotos selectedKeys={selectedKeys} />}
      {(isInTabScreen ?? false) && !isSelecting && <TabBarPadding />}

      <MenuModal modalVisible={menuModalVisible} handleModal={handleMenuModal}>
        <PhotoMenu />
      </MenuModal>
    </View>
  );
}

export default React.memo(PhotoGridController);
