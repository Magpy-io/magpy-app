import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import { spacing } from '~/styles/spacing';
import { typography } from '~/styles/typography';

import { BackIcon } from '../CommonComponents/Icons';

type PhotoGalleryHeaderProps = {
  title?: string;
  showBackButton?: boolean;
  onPressBack?: () => void;
  iconRight?: () => JSX.Element;
};

export function PhotoGalleryHeader(props: PhotoGalleryHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      {props.showBackButton ? (
        <BackIcon
          onPress={() => (props.onPressBack ? props.onPressBack() : () => {})}
          iconStyle={styles.elementPadding}
        />
      ) : (
        <View style={styles.elementPadding} />
      )}

      <Text style={styles.titleStyle}>{props.title}</Text>

      {props.iconRight ? <props.iconRight /> : <View style={styles.elementPadding} />}
    </View>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    ...typography.largeTextBold,
  },
  elementPadding: {
    padding: spacing.spacing_m,
  },
});
