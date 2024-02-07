import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MoreIcon } from '~/Components/CommonComponents/Icons';
import { PhotoGalleryHeader } from '~/Components/PhotoComponents/PhotoGalleryHeader';
import RecentPhotos from '~/Components/ServerComponents/RecentPhotos';
import ServerDetails from '~/Components/ServerComponents/ServerDetails';
import { appColors } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';

export default function ServerScreenTab() {
  console.log('render screen server');
  const optionsButton = () => <MoreIcon onPress={() => {}} iconStyle={styles.iconStyle} />;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.viewStyle, { paddingTop: insets.top }]}>
      <PhotoGalleryHeader title="Your server" iconRight={optionsButton} />
      <ServerDetails />
      <RecentPhotos />
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    backgroundColor: appColors.BACKGROUND,
  },
  iconStyle: {
    padding: spacing.spacing_m,
  },
});
