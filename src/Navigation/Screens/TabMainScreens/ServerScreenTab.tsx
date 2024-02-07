import React from 'react';
import { View } from 'react-native';

import { Text } from 'react-native-elements';

import PhotoGallery from '~/Components/PhotoComponents/PhotoGallery';

export default function ServerScreenTab() {
  console.log('render screen server');

  return (
    <View style={{ flex: 1, padding: 30 }}>
      <Text>Server</Text>
    </View>
  );
  return <PhotoGallery key={'gallery_server'} />;
}
