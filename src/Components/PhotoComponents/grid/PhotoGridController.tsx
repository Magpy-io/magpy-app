import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { TuneIcon } from '~/Components/CommonComponents/Icons';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/Photos/PhotosFunctions';
import { photosGalleryFilteredSelector } from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { RootState, useAppSelector } from '~/Context/ReduxStore/Store';
import { TabBarPadding } from '~/Navigation/TabNavigation/TabBar';
import { useTabNavigationContext } from '~/Navigation/TabNavigation/TabNavigationContext';
import { spacing } from '~/Styles/spacing';

import { useCustomBackPress } from '../../../Hooks/useCustomBackPress';
import { PhotoGalleryHeader } from '../PhotoGalleryHeader';
import ToolBarPhotos from '../common/ToolBarPhotos';
import FilterModal from './FilterModal';
import PhotoGridComponent, { PhotoGridComponentRefType } from './PhotoGridComponent';
import PhotoMenuModal from './PhotoMenuModal';
import SelectionBar from './SelectionBar';
import { useKeysSelection } from './useKeysSelection';

type PropsType = {
  photos: Array<PhotoGalleryType>;
  isSlidingPhotos: boolean;
  onSwitchMode: (isPhotoSelected: boolean, index: number) => void;
  isInTabScreen?: boolean;
  title?: string;
  showBackButton?: boolean;
  onPressBack?: () => void;
};

const PhotoGridController = forwardRef<PhotoGridComponentRefType, PropsType>(
  (
    {
      photos,
      isSlidingPhotos,
      onSwitchMode,
      isInTabScreen,
      title,
      showBackButton,
      onPressBack,
    }: PropsType,
    ref,
  ) => {
    const photosRef = useRef<PhotoGalleryType[]>(photos);
    photosRef.current = photos;

    const [isSelecting, setIsSelecting] = useState(false);
    const { selectSingle, selectAll, resetSelection, isSelected, countSelected, selectGroup } =
      useKeysSelection();
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
      const index = photosRef.current.findIndex(photo => photo.key == item.key);
      if (index < 0) {
        console.log('PhotoGridController: findPhotoIndex did not found index for photo');
        return 0;
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
          onSwitchMode(true, findPhotoIndex(item));
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

    const clearSelection = useCallback(() => {
      resetSelection();
    }, [resetSelection]);

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
          onRefresh={onRefresh}
          isSelecting={isSelecting}
          isSelected={isSelected}
          selectGroup={selectGroup}
          ref={ref}
        />

        {isSelecting && (
          <ToolBarPhotos
            selectedGalleryPhotos={selectedPhotos}
            clearSelection={clearSelection}
          />
        )}

        {isSelecting && (
          <SelectionBar
            selectedNb={countSelected()}
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
  },
);

PhotoGridController.displayName = 'PhotoGridController';

export default React.memo(PhotoGridController);
