import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { TuneIcon } from '~/Components/CommonComponents/Icons';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/Photos/PhotosFunctions';
import { photosGalleryFilteredSelector } from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { RootState, useAppSelector } from '~/Context/ReduxStore/Store';
import { TabBarPadding } from '~/Navigation/TabNavigation/TabBar';
import { useTabNavigationContext } from '~/Navigation/TabNavigation/TabNavigationContext';
import { spacing } from '~/Styles/spacing';

import { PhotoGalleryHeader } from '../PhotoGalleryHeader';
import ToolBarPhotos from '../common/ToolBarPhotos';
import { useCustomBackPress } from '../common/useCustomBackPress';
import FilterModal from './FilterModal';
import PhotoGridComponent from './PhotoGridComponent';
import PhotoMenuModal from './PhotoMenuModal';
import SelectionBar from './SelectionBar';
import { useKeysSelection } from './useKeysSelection';

type PropsType = {
  photos: Array<PhotoGalleryType>;
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
  currentPhotoIndex,
  isSlidingPhotos,
  onSwitchMode,
  isInTabScreen,
  title,
  showBackButton,
  onPressBack,
}: PropsType) {
  console.log('render grid');

  const photosRef = useRef<PhotoGalleryType[]>(photos);
  photosRef.current = photos;

  const [isSelecting, setIsSelecting] = useState(false);
  const photosSelection = useKeysSelection();
  const { selectSingle, selectAll, resetSelection, isSelected } = photosSelection;
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const { hideTab, showTab } = useTabNavigationContext();
  const { RefreshAllPhotos } = usePhotosFunctionsStore();

  const selectedPhotos = useAppSelector((state: RootState) =>
    photosGalleryFilteredSelector(state, isSelected),
  );

  const backPressAction = useCallback(() => {
    setIsSelecting(false);
    showTab();
  }, [showTab]);

  useCustomBackPress(backPressAction, isSelecting);

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

  const showMenuModal = () => setMenuModalVisible(true);
  const hideMenuModal = () => setMenuModalVisible(false);
  const showFilterModal = () => setFilterModalVisible(true);
  const hideFilterModal = () => setFilterModalVisible(false);

  const onRenderItemPress = useCallback(
    (item: PhotoGalleryType) => {
      if (isSelecting) {
        selectSingle(item);
      } else {
        onSwitchMode(true, findPhotoIndex(item) || 0);
      }
    },
    [isSelecting, selectSingle, onSwitchMode, findPhotoIndex],
  );

  const onRenderItemLongPress = useCallback(
    (item: PhotoGalleryType) => {
      if (!isSelecting) {
        hideTab();
        setIsSelecting(true);
        resetSelection(item);
      }
    },
    [hideTab, isSelecting, resetSelection],
  );

  const onBackButton = useCallback(() => {
    setIsSelecting(false);
    showTab();
  }, [setIsSelecting, showTab]);

  const onSelectAll = useCallback(() => {
    selectAll(photos);
  }, [photos, selectAll]);

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
        onPressPhoto={onRenderItemPress}
        onLongPressPhoto={onRenderItemLongPress}
        currentPhotoIndex={currentPhotoIndex}
        onRefresh={onRefresh}
        isSelecting={isSelecting}
        photosSelection={photosSelection}
      />

      {isSelecting && <ToolBarPhotos seletedGalleryPhotos={selectedPhotos} />}

      {isSelecting && (
        <SelectionBar
          selectedNb={photosSelection.countSelected()}
          onCancelButton={onBackButton}
          onSelectAllButton={onSelectAll}
        />
      )}

      {isInTabScreen && !isSelecting && <TabBarPadding />}

      <PhotoMenuModal
        visible={menuModalVisible}
        onRequestClose={hideMenuModal}
        onFilter={showFilterModal}
      />
      <FilterModal visible={filterModalVisible} onRequestClose={hideFilterModal} />
    </View>
  );
}

export default React.memo(PhotoGridController);
