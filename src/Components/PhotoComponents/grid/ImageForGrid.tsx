import React from 'react';
import { StyleSheet } from 'react-native';

import FastImage from 'react-native-fast-image';

import { borderRadius } from '~/Styles/spacing';

const ImageForGrid = ({ uri }: { uri: string | undefined }) => {
  //console.log('ImageFOrGrid render', uri);
  return (
    <FastImage
      source={{ uri: uri }}
      resizeMode={FastImage.resizeMode.cover}
      style={styles.imageStyle}
    />
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.image,
  },
});

export default React.memo(ImageForGrid);
