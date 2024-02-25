import React from 'react';
import { View } from 'react-native';

import { Text } from 'react-native-elements';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useStyles } from '~/Hooks/useStyles';

import Element from './Element';
import { Filter, FilterNameType, FilterObjectType } from './Filter';
import { makeFilterStyles } from './FilterStyle';

export type TypeFilterName = 'Type';
export type TypeFilterValue = 'photos' | 'videos';
export type TypeFilterObjectType = {
  type: TypeFilterName;
  params: { value: TypeFilterValue };
};

export class TypeFilter implements Filter {
  type: TypeFilterName;
  value: TypeFilterValue;

  constructor(value: TypeFilterValue) {
    this.type = 'Type';
    this.value = value;
  }

  filter(photos: PhotoGalleryType[]) {
    switch (this.value) {
      case 'photos':
        return photos;
      case 'videos':
        return [];
    }
  }

  toObject() {
    return { type: this.type, params: { value: this.value } };
  }
}

type TypeProps = {
  filter: TypeFilterObjectType | undefined;
  addOrEditFilter: (filter: FilterObjectType) => void;
  removeFilter: (type: FilterNameType) => void;
};

export function TypeFilterComponent({ filter, addOrEditFilter, removeFilter }: TypeProps) {
  const styles = useStyles(makeFilterStyles);

  const addTypeFilter = (value: TypeFilterValue) => {
    addOrEditFilter({ type: 'Type', params: { value: value } });
  };

  const removeTypeFilter = () => {
    removeFilter('Type');
  };
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Type</Text>
      <View style={styles.elementListView}>
        <Element
          title="All"
          selected={filter?.params?.value == null}
          onPress={removeTypeFilter}
        />
        <Element
          title="Photos"
          selected={filter?.params?.value === 'photos'}
          onPress={() => {
            addTypeFilter('photos');
          }}
        />
        <Element
          title="Videos"
          selected={filter?.params?.value === 'videos'}
          onPress={() => {
            addTypeFilter('videos');
          }}
        />
      </View>
    </View>
  );
}
