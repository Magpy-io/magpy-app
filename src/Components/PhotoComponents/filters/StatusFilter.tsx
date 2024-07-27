import React from 'react';
import { View } from 'react-native';

import { Text } from 'react-native-elements';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useStyles } from '~/Hooks/useStyles';

import Element from './Element';
import { Filter, FilterNameType, FilterObjectType } from './Filter';
import { makeFilterStyles } from './FilterStyle';

export type StatusFilterName = 'Status';
export type StatusFilterValue = 'inDevice' | 'inServer';
export type StatusFilterParams = { value: StatusFilterValue };

export type StatusFilterObjectType = {
  type: StatusFilterName;
  params: StatusFilterParams;
};

export class StatusFilter implements Filter {
  type: StatusFilterName;
  value: StatusFilterValue;

  constructor(params: StatusFilterParams) {
    this.type = 'Status';
    this.value = params.value;
  }

  filter(photos: PhotoGalleryType[]) {
    switch (this.value) {
      case 'inDevice':
        return photos.filter(photo => photo.mediaId);
      case 'inServer':
        return photos.filter(photo => photo.serverId);
    }
  }

  toObject() {
    return { type: this.type, params: { value: this.value } };
  }
}

type StatusProps = {
  filter: StatusFilterObjectType | undefined;
  addOrEditFilter: (filter: FilterObjectType) => void;
  removeFilter: (type: FilterNameType) => void;
};

export function StatusFilterComponent({ filter, addOrEditFilter, removeFilter }: StatusProps) {
  const styles = useStyles(makeFilterStyles);
  const addStatusFilter = (value: StatusFilterValue) => {
    addOrEditFilter({ type: 'Status', params: { value: value } });
  };

  const removeStatusFilter = () => {
    removeFilter('Status');
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Status</Text>
      <View style={styles.elementListView}>
        <Element
          title="All"
          selected={filter?.params?.value == null}
          onPress={removeStatusFilter}
        />
        <Element
          title="In device"
          selected={filter?.params?.value === 'inDevice'}
          onPress={() => {
            addStatusFilter('inDevice');
          }}
        />
        <Element
          title="In server"
          selected={filter?.params?.value === 'inServer'}
          onPress={() => {
            addStatusFilter('inServer');
          }}
        />
      </View>
    </View>
  );
}
