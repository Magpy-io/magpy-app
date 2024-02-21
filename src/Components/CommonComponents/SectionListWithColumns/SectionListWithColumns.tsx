import React, { useCallback, useMemo } from 'react';
import { SectionList, View } from 'react-native';

import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';

import { useOrientation } from '~/Hooks/useOrientation';

import { makeArrayOfRows } from './Helpers';
import {
  RowType,
  SectionListWithColumnsType,
  SectionType,
  SectionWithRowsType,
} from './Types';

type SectionListWithColumnsProps<ItemType, SectionData> = {
  sections: SectionType<ItemType, SectionData>[];
  numberColumns: number;
  renderItem: ({ item }: { item: ItemType }) => React.ReactElement | null;
  keyExtractor: (item: ItemType) => string;
  renderSectionHeader: (info: {
    section: SectionType<ItemType, SectionData>;
  }) => React.JSX.Element;
  onRefresh?: () => void;
  refreshing?: boolean;
  itemSpacing?: number;
  sectionHeaderHeight: number;
  mref?: React.Ref<SectionListWithColumnsType<ItemType, SectionData>>;
};

function SectionListWithColumns<ItemType, SectionData>({
  sections,
  renderItem,
  renderSectionHeader,
  keyExtractor,
  numberColumns,
  itemSpacing = 0,
  onRefresh,
  refreshing,
  sectionHeaderHeight,
  mref,
}: SectionListWithColumnsProps<ItemType, SectionData>) {
  const { width } = useOrientation();

  const totalSpacingHorizontal = itemSpacing * (numberColumns - 1);
  const itemSize = (width - totalSpacingHorizontal) / numberColumns;

  const sectionsWithRows = useMemo(() => {
    return sections.map(section => {
      return {
        sectionData: section.sectionData,
        data: makeArrayOfRows(section.data, numberColumns),
      };
    });
  }, [numberColumns, sections]);

  const renderRow = useCallback(
    ({ item: row }: { item: RowType<ItemType>; index: number }) => {
      return (
        <View style={{ flexDirection: 'row' }}>
          {row.map((rowItem, i) => {
            const marginLeft = i === 0 ? 0 : itemSpacing;
            return (
              <View
                style={[{ width: itemSize, height: itemSize }, { marginLeft: marginLeft }]}
                key={keyExtractor(rowItem)}>
                {renderItem({ item: rowItem })}
              </View>
            );
          })}
        </View>
      );
    },
    [itemSize, keyExtractor, renderItem, itemSpacing],
  );

  const rowKeyExtractor = useCallback(
    (item: RowType<ItemType>) => {
      return keyExtractor(item[0]);
    },
    [keyExtractor],
  );

  const getItemLayout: (
    data: SectionWithRowsType<ItemType, SectionData>[] | null,
    index: number,
  ) => {
    length: number;
    offset: number;
    index: number;
  } = useMemo(() => {
    const getItemLayoutFunction = sectionListGetItemLayout<RowType<ItemType>>({
      getItemHeight: () => itemSize,
      getSectionHeaderHeight: () => sectionHeaderHeight,
      getSeparatorHeight: () => itemSpacing,
    });

    return getItemLayoutFunction;
  }, [itemSize, sectionHeaderHeight, itemSpacing]);

  const renderSectionHeaderInner = useCallback(
    (info: { section: SectionWithRowsType<ItemType, SectionData> }) => {
      const sectionOriginal: SectionType<ItemType, SectionData> = {
        sectionData: info.section.sectionData,
        data: info.section.data.flat(),
      };

      return renderSectionHeader({ section: sectionOriginal });
    },
    [renderSectionHeader],
  );

  const Separator = useCallback(
    () => <View style={{ height: itemSpacing, width: '100%' }} />,
    [itemSpacing],
  );

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
