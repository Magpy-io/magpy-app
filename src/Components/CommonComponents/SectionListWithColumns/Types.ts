import { SectionList } from 'react-native';

export type RowType<T> = T[];
export type SectionWithRowsType<ItemType, SectionData> = {
  data: Array<RowType<ItemType>>;
  sectionData: SectionData;
};

export type SectionType<ItemType, SectionData> = {
  data: Array<ItemType>;
  sectionData: SectionData;
};

export type SectionListWithColumnsType<ItemType, SectionData> = SectionList<
  ItemType[],
  SectionWithRowsType<ItemType, SectionData>
>;
