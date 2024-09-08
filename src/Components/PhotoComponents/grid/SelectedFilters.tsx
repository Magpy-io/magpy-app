import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from 'react-native-elements';

import { CloseIcon } from '~/Components/CommonComponents/Icons';
import { usePhotoGalleryContext } from '~/Components/PhotoComponents/PhotoGalleryContext';
import { formatDate } from '~/Helpers/DateFunctions/DateFormatting';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { DateFilterObjectType } from '../filters/Filters/DateFilter';
import { FilterObjectType } from '../filters/Filters/Filter';
import { StatusFilterObjectType } from '../filters/Filters/StatusFilter';
import { TypeFilterObjectType } from '../filters/Filters/TypeFilter';

export default function SelectedFilters() {
  const { filters } = usePhotoGalleryContext();
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.viewStyle}>
      {filters?.map((filter, index) => {
        return <SelectedFilter key={`selected_filter_${index}`} filter={filter} />;
      })}
    </View>
  );
}

function SelectedFilter({ filter }: { filter: FilterObjectType }) {
  const { removeFilter } = usePhotoGalleryContext();
  const onPress = () => {
    removeFilter(filter);
  };

  switch (filter.type) {
    case 'Status':
      return <SelectedStatusFilter filter={filter} onPress={onPress} />;
    case 'Type':
      return <SelectedTypeFilter filter={filter} onPress={onPress} />;
    case 'Date':
      return <SelectedDateFilter filter={filter} onPress={onPress} />;
    default:
      return <View />;
  }
}

function SelectedDateFilter({
  filter,
  onPress,
}: {
  filter: DateFilterObjectType;
  onPress: () => void;
}) {
  let text = '';
  if (filter.params.label === 'thisYear') {
    text = 'This year';
  } else if (filter.params.label === 'lastYear') {
    text = 'Last year';
  } else {
    text = `${formatDate(filter.params.fromDate)} -> ${formatDate(filter.params.toDate)}`;
  }
  return <SelectedFilterBaseElement text={text} onPress={onPress} />;
}

function SelectedTypeFilter({
  filter,
  onPress,
}: {
  filter: TypeFilterObjectType;
  onPress: () => void;
}) {
  const text = filter.params.value === 'photos' ? 'Photos' : 'Videos';
  return <SelectedFilterBaseElement text={text} onPress={onPress} />;
}

function SelectedStatusFilter({
  filter,
  onPress,
}: {
  filter: StatusFilterObjectType;
  onPress: () => void;
}) {
  const text = filter.params.value === 'inDevice' ? 'In device' : 'In server';
  return <SelectedFilterBaseElement text={text} onPress={onPress} />;
}

function SelectedFilterBaseElement({ text, onPress }: { text: string; onPress: () => void }) {
  const styles = useStyles(makeStyles);

  return (
    <TouchableOpacity style={styles.filterView} onPress={onPress}>
      <Text style={styles.filterText}>{text}</Text>
      <CloseIcon size={18} />
    </TouchableOpacity>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    viewStyle: {
      flexDirection: 'row',
      gap: spacing.spacing_xs,
      marginHorizontal: spacing.spacing_m,
      marginTop: spacing.spacing_s,
      flexWrap: 'wrap',
    },
    filterView: {
      paddingVertical: spacing.spacing_xs,
      paddingHorizontal: spacing.spacing_s,
      backgroundColor: colors.BACKGROUND_LIGHT,
      borderRadius: borderRadius.default,
      flexDirection: 'row',
      gap: spacing.spacing_xxs,
      alignItems: 'center',
    },
    filterText: {
      ...typography(colors).mediumTextBold,
      color: colors.TEXT,
    },
  });
