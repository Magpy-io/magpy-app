import React, {type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import PhotoGrid from './src/Components/PhotoGrid'

const App = () => {

  return (
    <SafeAreaView style={styles.viewStyle}>
      <PhotoGrid/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flex:1,
    backgroundColor: "white",
  }
});

export default App;
