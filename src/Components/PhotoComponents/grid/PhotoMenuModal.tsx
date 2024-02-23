import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from 'react-native-elements';

import { FilterIcon, GroupIcon, SortIcon } from '~/Components/CommonComponents/Icons';
import MenuModal from '~/Components/CommonComponents/MenuModal';
import {
  setGroupBy,
  setSortBy,
} from '~/Context/ReduxStore/Slices/GalleryOptions/GalleryOptions';
import {
  GroupOptionSelector,
  SortOptionSelector,
} from '~/Context/ReduxStore/Slices/GalleryOptions/Selectors';
import { useAppDispatch, useAppSelector } from '~/Context/ReduxStore/Store';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

type PhotoMenuProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export default function PhotoMenu(props: PhotoMenuProps) {
  return (
    <MenuModal visible={props.visible} onRequestClose={props.onRequestClose}>
      <View style={{ gap: spacing.spacing_xs }}>
        <Filter />
        <Sort />
        <Group onRequestClose={props.onRequestClose} />
      </View>
    </MenuModal>
  );
}

function Filter() {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.filterView}>
      <TouchableOpacity style={styles.iconText} onPress={() => {}}>
        <FilterIcon size={ICON_SIZE} />
        <Text style={styles.text}>Filter</Text>
      </TouchableOpacity>
    </View>
  );
}

function Sort() {
  const styles = useStyles(makeStyles);
  const sortOption = useAppSelector(SortOptionSelector);
  const dispatch = useAppDispatch();
  return (
    <View style={styles.groupView}>
      <View style={styles.iconText}>
        <SortIcon size={ICON_SIZE} />
        <Text style={styles.text}>Sort by</Text>
      </View>
      <Text
        style={[styles.textPressable, sortOption === 'Newest' ? styles.selected : {}]}
        onPress={() => {
          dispatch(setSortBy({ option: 'Newest' }));
        }}>
        Newest first
      </Text>
      <Text
        style={[styles.textPressable, sortOption === 'Oldest' ? styles.selected : {}]}
        onPress={() => {
          dispatch(setSortBy({ option: 'Oldest' }));
        }}>
        Oldest first
      </Text>
    </View>
  );
}

function Group({ onRequestClose }: { onRequestClose: () => void }) {
  const styles = useStyles(makeStyles);
  const groupOption = useAppSelector(GroupOptionSelector);
  const dispatch = useAppDispatch();

  return (
    <View style={styles.groupView}>
      <View style={styles.iconText}>
        <GroupIcon size={ICON_SIZE} />
        <Text style={styles.text}>Group by</Text>
      </View>
      <Text
        style={[styles.textPressable, groupOption === 'Day' ? styles.selected : {}]}
        onPress={() => {
          onRequestClose();
          dispatch(setGroupBy({ option: 'Day' }));
        }}>
        Day
      </Text>
      <Text
        style={[styles.textPressable, groupOption === 'Month' ? styles.selected : {}]}
        onPress={() => {
          onRequestClose();
          dispatch(setGroupBy({ option: 'Month' }));
        }}>
        Month
      </Text>
      <Text
        style={[styles.textPressable, groupOption === 'Year' ? styles.selected : {}]}
        onPress={() => {
          onRequestClose();
          dispatch(setGroupBy({ option: 'Year' }));
        }}>
        Year
      </Text>
    </View>
  );
}

const ICON_SIZE = 18;

const makeStyles = (colors: colorsType, dark: boolean) =>
  StyleSheet.create({
    groupView: {
      gap: spacing.spacing_xs,
      padding: spacing.spacing_xs,
    },
    filterView: {
      padding: spacing.spacing_xs,
    },
    iconText: {
      flexDirection: 'row',
      gap: spacing.spacing_s,
      alignItems: 'center',
    },
    text: {
      ...typography(colors).mediumText,
    },
    textPressable: {
      ...typography(colors).mediumText,
      padding: spacing.spacing_xs,
      paddingHorizontal: spacing.spacing_s,
      marginLeft: spacing.spacing_xl,
      textAlign: 'center',
      borderRadius: borderRadius.small,
    },
    selected: {
      backgroundColor: dark ? colors.TRANSPARENT : colors.BACKGROUND_LIGHT,
      color: dark ? colors.SECONDARY : colors.TEXT,
    },
  });
