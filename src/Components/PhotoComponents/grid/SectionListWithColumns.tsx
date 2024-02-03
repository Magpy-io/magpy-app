import React from 'react';
import { SectionList, SectionListData, View } from 'react-native';

import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { useOrientation } from '~/Hooks/useOrientation';

type T = PhotoGalleryType;
type Section = { title: string; data: T[] };
type NewSection = { title: string; data: T[][] };

type SectionListWithColumnsType = {
  sections: Section[];
  columns: number;
  renderItem: ({ item, index }: { item: T; index?: number }) => React.ReactElement | null;
  keyExtractor: (item: T, index: number) => string;
  renderSectionHeader:
    | ((info: {
        section: SectionListData<T[], NewSection>;
      }) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null)
    | undefined;
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
  }: SectionListWithColumnsType,
  ref: React.LegacyRef<SectionList<T[]>> | undefined,
) {
  const { width } = useOrientation();
  const itemWidth = width / columns;
  const itemHeight = itemWidth;
  if (!sections) {
    return <View />;
  }

  const newSections: NewSection[] = [];
  sections.forEach(s => {
    newSections.push({
      title: s.title,
      data: makeArrayWithColumns(s.data, columns),
    });
  });

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

  const getItemLayout:
    | ((
        data: SectionListData<PhotoGalleryType[], NewSection>[] | null,
        index: number,
      ) => {
        length: number;
        offset: number;
        index: number;
      })
    | undefined = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData: T[][], sectionIndex: number, rowIndex: number) => itemHeight,
    getSectionHeaderHeight: () => 30, // The height of your section headers
  });

  return (
    <SectionList
      sections={newSections}
      renderItem={renderRow}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={rowKeyExtractor}
      getItemLayout={getItemLayout}
      ref={ref}
    />
  );
});

export default SectionListWithColumns;
