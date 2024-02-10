import React from 'react';
import { FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';

import { Text } from 'react-native-elements';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { recentServerGalleryPhotos } from '~/Context/ReduxStore/Slices/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useTheme } from '~/Context/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';
import { useMainNavigation } from '~/Navigation/Navigation';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import RecentPhotoComponent from './RecentPhotoComponent';

export default function RecentPhotos() {
  const photosGalleryServer = useAppSelector(recentServerGalleryPhotos);
  const navigation = useMainNavigation();
  const onPressSeeAll = () => {
    navigation.navigate('ServerGalleryScreen');
  };
  const renderItem = ({ item }: { item: PhotoGalleryType }) => {
    return <RecentPhotoComponent photo={item} />;
  };
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <>
      <View style={styles.headerStyle}>
        <Text style={styles.titleStyle}>Recently added</Text>
        <Text style={styles.textStyle} onPress={onPressSeeAll}>
          See all
        </Text>
      </View>

      <TouchableHighlight onPress={onPressSeeAll} underlayColor={colors.UNDERLAY}>
        <FlatList
          data={photosGalleryServer}
          renderItem={renderItem}
          horizontal
          ItemSeparatorComponent={Separator}
          ListFooterComponent={Footer}
          contentContainerStyle={styles.flatlistContainerStyle}
          showsHorizontalScrollIndicator={false}
        />
      </TouchableHighlight>
    </>
  );
}

const Separator = () => <View style={{ width: spacing.spacing_xs }} />;
const Footer = () => <View style={{ width: spacing.spacing_m }} />;

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    flatlistContainerStyle: {
      paddingLeft: spacing.spacing_m,
    },
    textStyle: {
      ...typography(colors).lightMediumText,
    },
    titleStyle: {
      ...typography(colors).largeTextBold,
    },
    headerStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.spacing_m,
    },
  });
