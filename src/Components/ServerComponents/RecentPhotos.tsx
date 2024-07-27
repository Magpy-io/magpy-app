import React from 'react';
import { FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';

import { Text } from 'react-native-elements';

import { useTheme } from '~/Context/Contexts/ThemeContext';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { recentServerGalleryPhotos } from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useStyles } from '~/Hooks/useStyles';
import { useMainStackNavigation } from '~/Navigation/Navigators/MainStackNavigator';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import RecentPhotoComponent from './RecentPhotoComponent';

export default function RecentPhotos() {
  const photosGalleryServer = useAppSelector(recentServerGalleryPhotos);
  const { navigate } = useMainStackNavigation();
  const onPressSeeAll = () => {
    navigate('ServerGalleryScreen');
  };
  const renderItem = ({ item }: { item: PhotoGalleryType }) => {
    return <RecentPhotoComponent photo={item} />;
  };
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  const noPhotos = photosGalleryServer?.length === 0;
  if (noPhotos) {
    return <View />;
  }

  return (
    <>
      <View style={styles.headerStyle}>
        <Text style={styles.titleStyle}>Recently added</Text>

        <TouchableHighlight
          style={styles.touchable}
          onPress={onPressSeeAll}
          underlayColor={colors.UNDERLAY}>
          <Text style={styles.textStyle}>See all</Text>
        </TouchableHighlight>
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
    touchable: {
      padding: spacing.spacing_xs,
      margin: spacing.spacing_xs,
      borderRadius: borderRadius.button,
    },
    flatlistContainerStyle: {
      paddingLeft: spacing.spacing_m,
    },
    textStyle: {
      ...typography(colors).lightMediumText,
    },
    titleStyle: {
      ...typography(colors).largeTextBold,
      paddingLeft: spacing.spacing_m,
    },
    headerStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
