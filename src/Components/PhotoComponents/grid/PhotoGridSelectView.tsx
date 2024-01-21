import React from 'react';

import { PhotoType } from '~/Helpers/types';

import StatusBarGridComponent from './StatusBarGridComponent';
import ToolBarGrid from './ToolBarGrid';

type PhotoGridSelectViewProps = {
  isSelecting: boolean;
  selectedIds: Map<string, PhotoType>;
  onAddLocal: () => void;
  onAddServer: () => void;
  onDeleteLocal: () => void;
  onDeleteServer: () => void;
  onSelectAll: () => void;
  onBackButton: () => void;
  contextLocation: string;
};

export default function PhotoGridSelectView({
  isSelecting,
  selectedIds,
  onAddServer,
  onAddLocal,
  onDeleteLocal,
  onDeleteServer,
  onBackButton,
  onSelectAll,
  contextLocation,
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
      {isSelecting && (
        <ToolBarGrid
          contextLocation={contextLocation}
          onAddLocal={onAddLocal}
          onAddServer={onAddServer}
          onDeleteLocal={onDeleteLocal}
          onDeleteServer={onDeleteServer}
        />
      )}
    </>
  );
}
