import { DateFilter } from './DateFilter';
import { Filter, FilterObjectType } from './Filter';
import { StatusFilter } from './StatusFilter';
import { TypeFilter } from './TypeFilter';

export class FilterFactory {
  createFilter(filter: FilterObjectType): Filter {
    switch (filter.type) {
      case 'Type':
        return new TypeFilter(filter.params);
      case 'Status':
        return new StatusFilter(filter.params);
      case 'Date':
        return new DateFilter(filter.params);
    }
  }
}
