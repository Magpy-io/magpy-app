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
    <View>
      <View style={{ alignSelf: 'center', padding: spacing.spacing_m }}>
        <Text style={styles.titleStyle}>{props.title}</Text>
      </View>

      <View style={{ position: 'absolute', left: 0 }}>
        {props.showBackButton && (
          <BackIcon
            onPress={() => (props.onPressBack ? props.onPressBack() : () => {})}
            iconStyle={styles.elementPadding}
          />
        )}
      </View>

      <View style={{ position: 'absolute', right: 0 }}>
        {props.iconRight && <props.iconRight />}
      </View>
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
