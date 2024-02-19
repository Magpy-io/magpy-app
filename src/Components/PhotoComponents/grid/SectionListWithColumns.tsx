import React, { useCallback, useMemo } from 'react';
import { SectionList, SectionListData, View } from 'react-native';

import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
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
  renderSectionHeader?: (info: {
    section: SectionListData<T[], NewSection>;
  }) => React.JSX.Element;
  onRefresh?: (() => void) | null;
  refreshing?: boolean | null;
  sectionHeaderHeight: number;
  mref: React.Ref<SectionList<T[], NewSection>> | null;
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

function SectionListWithColumns({
  sections,
  renderItem,
  renderSectionHeader,
  keyExtractor,
  columns,
  separatorSpace = 0,
  onRefresh,
  refreshing,
  sectionHeaderHeight,
  mref,
}: SectionListWithColumnsType) {
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

  const renderRow = useCallback(
    ({ item, index }: { item: T[]; index: number }) => {
      return (
        <View style={{ flexDirection: 'row' }}>
          {Array(columns).map((_, i) => {
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
    [itemHeight, itemWidth, keyExtractor, renderItem, separatorSpace, columns],
  );

  const rowKeyExtractor = useCallback(
    (item: T[], index: number) => {
      return keyExtractor(item[0], index);
    },
    [keyExtractor],
  );

  const getItemLayout: (
    data: SectionListData<PhotoGalleryType[], NewSection>[] | null,
    index: number,
  ) => {
    length: number;
    offset: number;
    index: number;
  } = useMemo(() => {
    const getItemLayoutFunction = sectionListGetItemLayout({
      // The height of the row with rowData at the given sectionIndex and rowIndex
      getItemHeight: () => itemHeight,
      getSectionHeaderHeight: () => sectionHeaderHeight, // The height of your section headers
      getSeparatorHeight: () => separatorSpace,
    });

    return (data: SectionListData<PhotoGalleryType[], NewSection>[] | null, index: number) => {
      if (!data) {
        return { length: 0, offset: 0, index: 0 };
      }
      return getItemLayoutFunction(data, index);
    };
  }, [itemHeight, sectionHeaderHeight, separatorSpace]);

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
      ref={mref}
    />
  );
}

export default SectionListWithColumns;
