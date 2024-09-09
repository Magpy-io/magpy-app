import React from 'react';
import { View } from 'react-native';

import { Text } from 'react-native-elements';

import { useStyles } from '~/Hooks/useStyles';

import Element from './Element';
import { makeFilterStyles } from './FilterStyle';
import { FilterNameType, FilterObjectType } from './Filters/Filter';
import { StatusFilterObjectType, StatusFilterValue } from './Filters/StatusFilter';

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
