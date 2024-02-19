import { SectionList } from 'react-native';

export type RowType<T> = T[];
export type SectionWithRowsType<T, U> = { data: Array<RowType<T>>; sectionData?: U };

export type SectionType<ItemType, SectionData> = {
  data: Array<ItemType>;
  sectionData?: SectionData;
};

export type SectionListWithColumnsType<ItemType, SectionData> = SectionList<
  ItemType[],
  SectionWithRowsType<ItemType, SectionData>
>;
