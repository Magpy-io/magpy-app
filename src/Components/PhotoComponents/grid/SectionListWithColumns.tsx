import React, { useCallback, useMemo } from 'react';
import { SectionList, SectionListData, View } from 'react-native';

import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { useOrientation } from '~/Hooks/useOrientation';

type T = PhotoGalleryType;
type Section = { title: string; data: T[] };
export type NewSection = { title: string; data: T[][] };

type SectionListWithColumnsType = {
  sections: Section[];
  columns: number;
  separatorSpace?: number;
  renderItem: ({ item, index }: { item: T; index?: number }) => React.ReactElement | null;
  keyExtractor: (item: T, index: number) => string;
  renderSectionHeader:
    | ((info: { section: SectionListData<T[], NewSection> }) => React.JSX.Element)
    | undefined;
  onRefresh?: (() => void) | null | undefined;
  refreshing?: boolean | null | undefined;
  sectionHeaderHeight: number;
};

// converts any array like to an array of columns elements
// example : array [1,2,3,4,5,6] with columns 3 returns a new array [[1,2,3], [4,5,6]]
function makeArrayWithColumns<T>(array: T[], columns: number) {
  const newArray = [];
  const newArrayLength = Math.ceil(array.length / columns);
  for (let i = 0; i < newArrayLength; i++) {
    newArray.push(array.slice(i * columns, i * columns + columns));
  }
  return newArray;
}

const SectionListWithColumns = React.forwardRef(function SectionListWithColumns(
  {
    sections,
    renderItem,
    renderSectionHeader,
    keyExtractor,
    columns,
    separatorSpace = 0,
    onRefresh,
    refreshing,
    sectionHeaderHeight,
  }: SectionListWithColumnsType,
  ref: React.LegacyRef<SectionList<T[]>> | undefined,
) {
  const { width } = useOrientation();
  const totalEmptySpace = separatorSpace * (columns - 1);
  const itemWidth = (width - totalEmptySpace) / columns;
  const itemHeight = itemWidth;
  const Separator = useCallback(
    () => <View style={{ height: separatorSpace, width: '100%' }} />,
    [separatorSpace],
  );

  const newSections = useMemo(() => {
    const newSectionsArray: NewSection[] = [];
    sections.forEach(s => {
      newSectionsArray.push({
        title: s.title,
        data: makeArrayWithColumns(s.data, columns),
      });
    });
    return newSectionsArray;
  }, [columns, sections]);

  // [0,1,2] for columns === 3
  const ArrayColumns = useMemo(
    () =>
      Array(columns)
        .fill(0)
        .map((u, i) => i),
    [columns],
  );

  const renderRow = useCallback(
    ({ item, index }: { item: T[]; index: number }) => {
      return (
        <View style={{ flexDirection: 'row' }}>
          {ArrayColumns.map(i => {
            if (item[i]) {
              const padding = i === 0 ? {} : { marginLeft: separatorSpace };
              return (
                <View
                  style={[{ width: itemWidth, height: itemHeight }, padding]}
                  key={keyExtractor(item[i], index)}>
                  {renderItem({ item: item[i] })}
                </View>
              );
            }
          })}
        </View>
      );
    },
    [ArrayColumns, itemHeight, itemWidth, keyExtractor, renderItem, separatorSpace],
  );

  const rowKeyExtractor = useCallback(
    (item: T[], index: number) => {
      return keyExtractor(item[0], index);
    },
    [keyExtractor],
  );

  const getItemLayout:
    | ((
        data: SectionListData<PhotoGalleryType[], NewSection>[] | null,
        index: number,
      ) => {
        length: number;
        offset: number;
        index: number;
      })
    | undefined = useMemo(
    () =>
      sectionListGetItemLayout({
        // The height of the row with rowData at the given sectionIndex and rowIndex
        getItemHeight: () => itemHeight,
        getSectionHeaderHeight: () => sectionHeaderHeight, // The height of your section headers
        getSeparatorHeight: () => separatorSpace,
      }),
    [itemHeight, sectionHeaderHeight, separatorSpace],
  );

  if (!sections) {
    return <View />;
  }

  return (
    <SectionList
      sections={newSections}
      renderItem={renderRow}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={rowKeyExtractor}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={Separator}
      refreshing={refreshing}
      onRefresh={onRefresh}
      windowSize={11}
      ref={ref}
    />
  );
});

export default SectionListWithColumns;
