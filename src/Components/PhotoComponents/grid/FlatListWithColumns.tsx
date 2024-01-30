import React from 'react';
import { FlatList, StyleProp, View, ViewStyle } from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { useOrientation } from '~/Hooks/useOrientation';

type T = PhotoGalleryType;

type FlatListWithColumnsType = {
  data: T[];
  renderItem: ({ item, index }: { item: T; index?: number }) => React.ReactElement | null;
  columns: number;
  keyExtractor: (item: T, index: number) => string;
  refreshing?: boolean | null;
  onRefresh?: (() => void) | null;
  onEndReachedThreshold?: number | null;
  initialNumToRender?: number;
  maxToRenderPerBatch?: number;
  windowSize?: number;
  style?: StyleProp<ViewStyle>;
};

const FlatListWithColumns = React.forwardRef(function FlatListWithColumns(
  { data, columns, renderItem, keyExtractor, ...props }: FlatListWithColumnsType,
  ref: React.LegacyRef<FlatList<T[]>> | undefined,
) {
  const { width } = useOrientation();
  const itemWidth = width / columns;
  const itemHeight = itemWidth;
  if (!data) {
    return <View />;
  }

  const newArray = [];
  const newArrayLength = Math.ceil(data.length / columns);
  for (let i = 0; i < newArrayLength; i++) {
    newArray.push(data.slice(i * columns, i * columns + columns));
  }

  const renderRow = ({ item, index }: { item: T[]; index: number }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {Array(columns)
          .fill(0)
          .map((u, i) => i)
          .map(i => {
            if (item[i]) {
              return (
                <View
                  style={{ width: itemWidth, height: itemHeight }}
                  key={keyExtractor(item[i], index)}>
                  {renderItem({ item: item[i] })}
                </View>
              );
            }
          })}
      </View>
    );
  };

  function rowKeyExtractor(item: T[], index: number) {
    return keyExtractor(item[0], index);
  }

  function getItemLayout(
    data: ArrayLike<PhotoGalleryType[]> | null | undefined,
    index: number,
  ) {
    return {
      length: itemHeight,
      offset: itemHeight * index,
      index,
    };
  }

  return (
    <FlatList
      ref={ref}
      data={newArray}
      renderItem={renderRow}
      keyExtractor={rowKeyExtractor}
      getItemLayout={getItemLayout}
      {...props}
    />
  );
});

export default FlatListWithColumns;
