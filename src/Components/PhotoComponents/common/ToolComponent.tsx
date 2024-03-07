import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { CustomIconProps } from '~/Components/CommonComponents/Icons';
import { useTheme } from '~/Context/ThemeContext';
import { useOrientation } from '~/Hooks/useOrientation';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

type ToolComponentProps = {
  icon: (props: CustomIconProps) => JSX.Element;
  text?: string;
  onPress: () => void;
  showNumber?: boolean;
  number?: number;
};

//last one is partially visible
const NUM_TOOLS_VISIBLE = 5;

const ToolComponent = React.memo(function ToolComponent({
  icon: Icon,
  ...props
}: ToolComponentProps) {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const { width, orientation } = useOrientation();
  const toolWidth =
    width / NUM_TOOLS_VISIBLE + width / (NUM_TOOLS_VISIBLE * 2 * (NUM_TOOLS_VISIBLE - 1));
  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={[
        styles.toolComponent,
        orientation === 'PORTRAIT' ? { width: toolWidth } : { width: 100 },
      ]}
      underlayColor={colors.UNDERLAY}>
      <View style={styles.iconTextView}>
        <Icon containerStyle={styles.iconContainerStyle} />
        {props.text ? <Text style={styles.textStyle}>{props.text}</Text> : null}
        {props.showNumber ? (
          <Text style={styles.numberStyle}>{`(${props.number})`}</Text>
        ) : null}
      </View>
    </TouchableHighlight>
  );
});

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    textStyle: {
      ...typography(colors).smallText,
      color: colors.TEXT,
      textAlign: 'center',
      maxWidth: 100,
      paddingTop: 4,
    },
    numberStyle: {
      ...typography(colors).smallTextBold,
      color: colors.ACCENT,
      textAlign: 'center',
      maxWidth: 100,
      paddingTop: 2,
    },
    iconTextView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    toolComponent: {
      paddingVertical: spacing.spacing_l,
    },
    iconContainerStyle: {},
  });

export default ToolComponent;
