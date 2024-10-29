import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PhotoGalleryHeader from '~/Components/PhotoComponents/PhotoGalleryHeader';
import RecentPhotos from '~/Components/ServerComponents/RecentPhotos';
import ServerDetails from '~/Components/ServerComponents/ServerDetails';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';

export default function ServerScreenTab() {
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.viewStyle, { paddingTop: insets.top }]}>
      <PhotoGalleryHeader title="Your server" />
      <ServerDetails />
      <RecentPhotos />
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    viewStyle: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
    },
    iconStyle: {
      padding: spacing.spacing_m,
    },
  });
