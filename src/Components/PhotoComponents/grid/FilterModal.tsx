import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { produce } from 'immer';
import { Text } from 'react-native-elements';

import BottomModal from '~/Components/CommonComponents/BottomModal';
import { PrimaryButton } from '~/Components/CommonComponents/Buttons';
import { CloseIcon } from '~/Components/CommonComponents/Icons';
import { usePhotoGalleryContext } from '~/Components/PhotoComponents/PhotoGalleryContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import DateFilterComponent from '../filters/DateFilterComponent';
import { FilterNameType, FilterObjectType } from '../filters/Filters/Filter';
import { StatusFilterComponent } from '../filters/StatusFilterComponent';
import { TypeFilterComponent } from '../filters/TypeFilterComponent';
import { filterPhotos } from '../filters/functions';

type FilterModalProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export default function FilterModal({ visible, onRequestClose }: FilterModalProps) {
  const { isServer, filters: storeFilters, addFilters, photos } = usePhotoGalleryContext();

  const styles = useStyles(makeStyles);
  const [filters, setFilters] = useState<FilterObjectType[]>([]);

  const lastVisibleRef = useRef(visible);

  useEffect(() => {
    if (lastVisibleRef.current !== visible) {
      setFilters(storeFilters);
    }
    lastVisibleRef.current = visible;
  }, [storeFilters, visible, lastVisibleRef]);

  const onSubmit = () => {
    onRequestClose();
    addFilters(filters);
  };

  const TypeFilterObject = filters?.find(f => f.type === 'Type');

  const StatusFilterObject = filters?.find(f => f.type === 'Status');

  const DateFilterObject = filters?.find(f => f.type === 'Date');

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

  const removeFilter = useCallback((type: FilterNameType) => {
    setFilters(
      produce(draftFilters => {
        return draftFilters.filter(f => f.type != type);
      }),
    );
  }, []);

  const filteredPhotos = useMemo(() => filterPhotos(photos, filters), [filters, photos]);
  const filteredPhotosNumber = filteredPhotos.length;

  return (
    <BottomModal modalVisible={visible} onRequestClose={onRequestClose}>
      <View style={styles.viewStyle}>
        <Header onClose={onRequestClose} />
        <TypeFilterComponent
          filter={TypeFilterObject}
          addOrEditFilter={addOrEditFilter}
          removeFilter={removeFilter}
        />
        {!isServer && (
          <StatusFilterComponent
            filter={StatusFilterObject}
            addOrEditFilter={addOrEditFilter}
            removeFilter={removeFilter}
          />
        )}
        <DateFilterComponent
          filter={DateFilterObject}
          addOrEditFilter={addOrEditFilter}
          removeFilter={removeFilter}
        />
        <Submit onSubmit={onSubmit} filteredPhotosNumber={filteredPhotosNumber} />
      </View>
    </BottomModal>
  );
}

function Submit({
  onSubmit,
  filteredPhotosNumber,
}: {
  onSubmit: () => void;
  filteredPhotosNumber: number;
}) {
  return (
    <PrimaryButton
      title={`Show ${filteredPhotosNumber} items`}
      containerStyle={{ alignSelf: 'flex-end', marginTop: spacing.spacing_xl }}
      onPress={onSubmit}
    />
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
      gap: spacing.spacing_xl,
    },
    headerTitle: {
      ...typography(colors).mediumTextBold,
    },
    title: {
      ...typography(colors).largeTextBold,
    },
  });
