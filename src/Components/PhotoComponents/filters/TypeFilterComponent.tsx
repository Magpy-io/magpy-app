import React from 'react';
import { View } from 'react-native';

import { Text } from 'react-native-elements';

import { useStyles } from '~/Hooks/useStyles';

import Element from './Element';
import { makeFilterStyles } from './FilterStyle';
import { FilterNameType, FilterObjectType } from './Filters/Filter';
import { TypeFilterObjectType, TypeFilterValue } from './Filters/TypeFilter';

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
