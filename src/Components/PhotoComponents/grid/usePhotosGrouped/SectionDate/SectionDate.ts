export type SectionDateType = 'Day' | 'Month' | 'Year';

export interface SectionDate {
  type: SectionDateType;

  includesDate(date: string): boolean;

  getTitle(): string;
}
