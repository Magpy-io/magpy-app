import React from 'react';
import {
  FlatList,
  SectionList,
  SectionListProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { useOrientation } from '~/Hooks/useOrientation';

type T = PhotoGalleryType;

type SectionListWithColumnsType = {
  // data: T[];
  // renderItem: ({ item, index }: { item: T; index?: number }) => React.ReactElement | null;
  // columns: number;
  // keyExtractor: (item: T, index: number) => string;
  // refreshing?: boolean | null;
  // onRefresh?: (() => void) | null;
  // onEndReachedThreshold?: number | null;
  // initialNumToRender?: number;
  // maxToRenderPerBatch?: number;
  // windowSize?: number;
  // style?: StyleProp<ViewStyle>;
};

const SectionListWithColumns = React.forwardRef(function SectionListWithColumns(
  { ...props }: SectionListWithColumnsType,
  ref: React.LegacyRef<SectionList<T[]>> | undefined,
) {
  return <SectionList ref={ref} {...props} />;
});

export default SectionListWithColumns;
