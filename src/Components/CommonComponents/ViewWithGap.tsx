import React from 'react';
import { View, ViewProps } from 'react-native';

type ViewWithGapProps = { gap: number; children: JSX.Element[] } & ViewProps;

export default function ViewWithGap({ gap, children, ...props }: ViewWithGapProps) {
  const newChildren: JSX.Element[] = [];
  children?.map((c, index) => {
    newChildren.push(c);
    if (index < children?.length - 1) {
      newChildren.push(<View key={index} style={{ width: gap, height: gap }} />);
    }
  });
  return <View {...props}>{newChildren}</View>;
}
