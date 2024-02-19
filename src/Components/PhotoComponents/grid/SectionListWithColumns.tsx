import React, { useCallback, useMemo } from 'react';
import { SectionList, View } from 'react-native';

import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useOrientation } from '~/Hooks/useOrientation';

type U = { title: string };
type T = PhotoGalleryType;
export type RowType = T[];

export type SectionType = { data: Array<T>; sectionData?: U };
export type SectionWithRowsType = { data: Array<RowType>; sectionData?: U };

export type SectionListWithColumnsType = SectionList<T[], SectionWithRowsType>;

type SectionListWithColumnsProps = {
  sections: SectionType[];
  columns: number;
  separatorSpace?: number;
  renderItem: ({ item }: { item: T }) => React.ReactElement | null;
  keyExtractor: (item: T, index: number) => string;
  renderSectionHeader: (info: { section: SectionType }) => React.JSX.Element;
  onRefresh?: () => void;
  refreshing?: boolean;
  sectionHeaderHeight: number;
  mref?: React.Ref<SectionListWithColumnsType>;
};

function makeArrayOfRows(array: Array<T>, columns: number): T[][] {
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
}: SectionListWithColumnsProps) {
  const { width } = useOrientation();
  const totalEmptySpace = separatorSpace * (columns - 1);
  const itemWidth = (width - totalEmptySpace) / columns;
  const itemHeight = itemWidth;

  const Separator = useCallback(
    () => <View style={{ height: separatorSpace, width: '100%' }} />,
    [separatorSpace],
  );

  const sectionsWithRows = useMemo(() => {
    const newSectionsArray: SectionWithRowsType[] = [];
    sections.forEach(s => {
      const newSection: SectionWithRowsType = {
        sectionData: s.sectionData,
        data: makeArrayOfRows(s.data, columns),
      };

      newSectionsArray.push(newSection);
    });
    return newSectionsArray;
  }, [columns, sections]);

  const renderRow = useCallback(
    ({ item, index }: { item: RowType; index: number }) => {
      return (
        <View style={{ flexDirection: 'row' }}>
          {Array(columns)
            .fill(0)
            .map((_, i) => {
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
    data: SectionWithRowsType[] | null,
    index: number,
  ) => {
    length: number;
    offset: number;
    index: number;
  } = useMemo(() => {
    const getItemLayoutFunction = sectionListGetItemLayout<RowType>({
      getItemHeight: () => itemHeight,
      getSectionHeaderHeight: () => sectionHeaderHeight,
      getSeparatorHeight: () => separatorSpace,
    });

    return getItemLayoutFunction;
  }, [itemHeight, sectionHeaderHeight, separatorSpace]);

  const renderSectionHeaderInner = useCallback(
    (info: { section: SectionWithRowsType }) => {
      const sectionOriginal: SectionType = {
        sectionData: info.section.sectionData,
        data: info.section.data.flat(),
      };

      return renderSectionHeader({ section: sectionOriginal });
    },
    [renderSectionHeader],
  );

  if (!sections) {
    return <View />;
  }

  return (
    <SectionList
      sections={sectionsWithRows}
      renderItem={renderRow}
      renderSectionHeader={renderSectionHeaderInner}
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
