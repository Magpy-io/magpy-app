import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { produce } from 'immer';
import { Text } from 'react-native-elements';

import BottomModal from '~/Components/CommonComponents/BottomModal';
import { PrimaryButton } from '~/Components/CommonComponents/Buttons';
import { CloseIcon } from '~/Components/CommonComponents/Icons';
import { FiltersSelector } from '~/Context/ReduxStore/Slices/GalleryFilters/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import useEffectOnChange from '~/Hooks/useEffectOnChange';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import {
  FilterObjectType,
  StatusFilterObjectType,
  StatusFilterValue,
  TypeFilterObjectType,
  TypeFilterValue,
} from './Filter';

type FilterModalProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export default function FilterModal({ visible, onRequestClose }: FilterModalProps) {
  const styles = useStyles(makeStyles);
  const [filters, setFilters] = useState<FilterObjectType[]>([]);

  const { filters: storeFilters } = useAppSelector(FiltersSelector);

  useEffectOnChange(visible, () => {
    setFilters(storeFilters);
  });

  console.log('filters', filters);

  const onSubmit = () => {};

  const TypeFilter = filters?.find(f => f.type === 'Type') as TypeFilterObjectType | undefined;
  const StatusFilter = filters?.find(f => f.type === 'Status') as
    | StatusFilterObjectType
    | undefined;

  const addOrEditFilter = useCallback((filter: FilterObjectType) => {
    setFilters(
      produce(draftFilters => {
        const foundFilter = draftFilters?.find(f => f.type === filter.type);
        if (foundFilter) {
          foundFilter.params = filter.params;
        } else {
          draftFilters.push(filter);
        }
      }),
    );
  }, []);

  const removeFilter = useCallback((filter: FilterObjectType) => {
    setFilters(
      produce(draftFilters => {
        return draftFilters.filter(f => f.type != filter.type);
      }),
    );
  }, []);

  return (
    <BottomModal modalVisible={visible} onRequestClose={onRequestClose}>
      <View style={styles.viewStyle}>
        <Header onClose={onRequestClose} />
        <Type
          filter={TypeFilter}
          addOrEditFilter={addOrEditFilter}
          removeFilter={removeFilter}
        />
        <Status
          filter={StatusFilter}
          addOrEditFilter={addOrEditFilter}
          removeFilter={removeFilter}
        />
        <Date />
        <Submit onSubmit={onSubmit} />
      </View>
    </BottomModal>
  );
}

function Submit({ onSubmit }: { onSubmit: () => void }) {
  return (
    <PrimaryButton
      title={'Show items'}
      containerStyle={{ alignSelf: 'flex-end' }}
      onPress={onSubmit}
    />
  );
}

type StatusProps = {
  filter: StatusFilterObjectType | undefined;
  addOrEditFilter: (filter: FilterObjectType) => void;
  removeFilter: (filter: FilterObjectType) => void;
};

function Status({ filter, addOrEditFilter, removeFilter }: StatusProps) {
  const styles = useStyles(makeStyles);
  const addStatusFilter = (value: StatusFilterValue) => {
    addOrEditFilter({ type: 'Status', params: { value: value } });
  };

  const removeStatusFilter = () => {
    removeFilter({ type: 'Status', params: { value: 'inDevice' } });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Status</Text>
      <View style={styles.elementListView}>
        <Element
          title="All"
          selected={filter?.params?.value == null}
          onPress={removeStatusFilter}
        />
        <Element
          title="In device"
          selected={filter?.params?.value === 'inDevice'}
          onPress={() => {
            addStatusFilter('inDevice');
          }}
        />
        <Element
          title="In server"
          selected={filter?.params?.value === 'inServer'}
          onPress={() => {
            addStatusFilter('inServer');
          }}
        />
      </View>
    </View>
  );
}

type TypeProps = {
  filter: TypeFilterObjectType | undefined;
  addOrEditFilter: (filter: FilterObjectType) => void;
  removeFilter: (filter: FilterObjectType) => void;
};

function Type({ filter, addOrEditFilter, removeFilter }: TypeProps) {
  const styles = useStyles(makeStyles);

  const addTypeFilter = (value: TypeFilterValue) => {
    addOrEditFilter({ type: 'Type', params: { value: value } });
  };

  const removeTypeFilter = () => {
    removeFilter({ type: 'Type', params: { value: 'photos' } });
  };
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Type</Text>
      <View style={styles.elementListView}>
        <Element
          title="All"
          selected={filter?.params?.value == null}
          onPress={removeTypeFilter}
        />
        <Element
          title="Photos"
          selected={filter?.params?.value === 'photos'}
          onPress={() => {
            addTypeFilter('photos');
          }}
        />
        <Element
          title="Videos"
          selected={filter?.params?.value === 'videos'}
          onPress={() => {
            addTypeFilter('videos');
          }}
        />
      </View>
    </View>
  );
}

function Date() {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Date</Text>
      <View style={styles.elementListView}>
        <Element title="All time" selected onPress={() => {}} />
        <Element title="This year" onPress={() => {}} />
        <Element title="Last year" onPress={() => {}} />
      </View>
    </View>
  );
}

type ElementProps = {
  title: string;
  selected?: boolean;
  onPress: () => void;
};

function Element({ title, selected, onPress }: ElementProps) {
  const styles = useStyles(makeStyles);
  return (
    <Pressable
      style={[styles.elementView, selected ? styles.selectedElementView : {}]}
      onPress={onPress}>
      <Text style={[styles.elementTitle, selected ? styles.selectedElementTitle : {}]}>
        {title}
      </Text>
    </Pressable>
  );
}

function Header({ onClose }: { onClose: () => void }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.header}>
      <CloseIcon iconStyle={styles.closeIcon} onPress={onClose} />
      <Text style={styles.headerTitle}>Filters</Text>
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    elementListView: {
      gap: spacing.spacing_s,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    elementView: {
      paddingVertical: spacing.spacing_s,
      paddingHorizontal: spacing.spacing_l,
      backgroundColor: colors.BACKGROUND_LIGHT,
      borderRadius: borderRadius.small,
    },
    elementTitle: {
      ...typography(colors).mediumTextBold,
    },
    selectedElementView: {
      backgroundColor: colors.PRIMARY,
    },
    selectedElementTitle: {
      color: colors.TEXT_INVERSE,
    },
    section: {
      gap: spacing.spacing_m,
    },
    closeIcon: {
      padding: spacing.spacing_xxs,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.spacing_xs,
    },
    viewStyle: {
      gap: spacing.spacing_xxl,
    },
    headerTitle: {
      ...typography(colors).mediumTextBold,
    },
    title: {
      ...typography(colors).largeTextBold,
    },
  });
