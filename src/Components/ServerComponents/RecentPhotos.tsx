import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { serverGalleryPhotosSelector } from '~/Context/ReduxStore/Slices/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useMainNavigation } from '~/Navigation/Navigation';
import { spacing } from '~/styles/spacing';
import { typography } from '~/styles/typography';

import RecentPhotoComponent from './RecentPhotoComponent';

export default function RecentPhotos() {
  const photosGalleryServer = useAppSelector(serverGalleryPhotosSelector);
  const renderItem = ({ item }: { item: PhotoGalleryType }) => {
    return <RecentPhotoComponent photo={item} />;
  };
  const navigation = useMainNavigation();
  const onPressSeeAll = () => {
    navigation.navigate('ServerGalleryScreen');
  };

  return (
    <>
      <View style={styles.headerStyle}>
        <Text style={styles.titleStyle}>Recently added</Text>
        <Text style={styles.textStyle} onPress={onPressSeeAll}>
          See all
        </Text>
      </View>

      <FlatList
        data={photosGalleryServer}
        renderItem={renderItem}
        horizontal
        ItemSeparatorComponent={Separator}
        ListFooterComponent={Footer}
        contentContainerStyle={styles.flatlistContainerStyle}
        showsHorizontalScrollIndicator={false}
      />
    </>
  );
}

const Separator = () => <View style={{ width: spacing.spacing_xs }} />;
const Footer = () => <View style={{ width: spacing.spacing_m }} />;

const styles = StyleSheet.create({
  flatlistContainerStyle: {
    paddingLeft: spacing.spacing_m,
  },
  textStyle: {
    ...typography.lightMediumText,
  },
  titleStyle: {
    ...typography.largeTextBold,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.spacing_m,
  },
});
