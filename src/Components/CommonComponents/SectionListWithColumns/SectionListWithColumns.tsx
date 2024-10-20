import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react';
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

export type SectionListWithColumnsRefType = {
  scrollToLocation: (location: {
    sectionIndex: number;
    itemIndex?: number;
    animated?: boolean;
  }) => void;
};

function rowKeyExtractor<ItemType extends { key: string }>(item: RowType<ItemType>) {
  return item[0].key;
}

type SectionListWithColumnsProps<ItemType extends { key: string }, SectionData> = {
  sections: SectionType<ItemType, SectionData>[];
  numberColumns: number;
  renderItem: ({ item }: { item: ItemType }) => React.ReactElement | null;
  renderSectionHeader: (info: {
    section: SectionType<ItemType, SectionData>;
  }) => React.JSX.Element;
  onRefresh?: () => void;
  refreshing?: boolean;
  itemSpacing?: number;
  sectionHeaderHeight: number;
  mref: React.MutableRefObject<SectionListWithColumnsRefType | null>;
  ListHeaderComponent?: (() => JSX.Element) | JSX.Element;
  listHeaderHeight?: number;
};

function SectionListWithColumns<ItemType extends { key: string }, SectionData>({
  sections,
  renderItem,
  renderSectionHeader,
  numberColumns,
  itemSpacing = 0,
  onRefresh,
  refreshing,
  sectionHeaderHeight,
  mref,
  ListHeaderComponent,
  listHeaderHeight,
}: SectionListWithColumnsProps<ItemType, SectionData>) {
  const { width } = useOrientation();

  const sectionListRef = useRef<SectionListWithColumnsType<ItemType, SectionData>>(null);
  const totalSpacingHorizontal = itemSpacing * (numberColumns - 1);
  const itemSize = (width - totalSpacingHorizontal) / numberColumns;

  useImperativeHandle(mref, () => {
    return {
      scrollToLocation(location) {
        if (location.itemIndex == null) {
          sectionListRef.current?.scrollToLocation({ ...location, itemIndex: 0 });
        } else {
          // +1 to make an itemIndex of 0 scroll to the first element in the section instead of the section header
          sectionListRef.current?.scrollToLocation({
            ...location,
            itemIndex: Math.floor(location.itemIndex / numberColumns) + 1,
          });
        }
      },
    };
  }, [numberColumns]);

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
                key={rowItem.key}>
                {renderItem({ item: rowItem })}
              </View>
            );
          })}
        </View>
      );
    },
    [itemSize, renderItem, itemSpacing],
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
      listHeaderHeight: () => listHeaderHeight ?? 0,
    });

    return getItemLayoutFunction;
  }, [itemSize, sectionHeaderHeight, itemSpacing, listHeaderHeight]);

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
      ListHeaderComponent={ListHeaderComponent}
      renderSectionHeader={renderSectionHeaderInner}
      keyExtractor={rowKeyExtractor}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={Separator}
      refreshing={refreshing}
      onRefresh={onRefresh}
      windowSize={3}
      ref={sectionListRef}
    />
  );
}

export default SectionListWithColumns;
