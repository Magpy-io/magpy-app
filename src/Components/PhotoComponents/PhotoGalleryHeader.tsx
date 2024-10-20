import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { BackIcon } from '../CommonComponents/Icons';

type PhotoGalleryHeaderProps = {
  title?: string;
  showBackButton?: boolean;
  onPressBack?: () => void;
  iconRight?: () => JSX.Element;
};

function PhotoGalleryHeader(props: PhotoGalleryHeaderProps) {
  const styles = useStyles(makeStyles);

  return (
    <View>
      <View style={{ alignSelf: 'center', padding: spacing.spacing_s }}>
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
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    titleStyle: {
      ...typography(colors).extraLargeTextBold,
    },
    elementPadding: {
      padding: spacing.spacing_m,
    },
  });

export default React.memo(PhotoGalleryHeader);
