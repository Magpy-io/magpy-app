import React from 'react';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';

import StatusBarGridComponent from './StatusBarGridComponent';
import ToolBarGrid from './ToolBarGrid';

type PhotoGridSelectViewProps = {
  isSelecting: boolean;
  selectedIds: Map<string, PhotoGalleryType>;
  onSelectAll: () => void;
  onBackButton: () => void;
};

export default function PhotoGridSelectView({
  isSelecting,
  selectedIds,
  onBackButton,
  onSelectAll,
}: PhotoGridSelectViewProps) {
  return (
    <>
      {isSelecting && (
        <StatusBarGridComponent
          selectedNb={selectedIds.size}
          onCancelButton={onBackButton}
          onSelectAllButton={onSelectAll}
        />
      )}
      {isSelecting && <ToolBarGrid />}
    </>
  );
}
