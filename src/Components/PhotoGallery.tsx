import { StyleSheet, View } from "react-native";

import { useState } from "react";
import PhotoGrid from "~/Components/PhotoGrid";
import PhotoSlider from "~/Components/PhotoSlider";

import {
  ContextSourceTypes,
  useSelectedContext,
} from "~/Components/ContextProvider";

type PropsType = {
  contextSource: ContextSourceTypes;
};

export default function PhotoGallery(props: PropsType) {
  const context = useSelectedContext(props.contextSource);

  const [switchingState, setSwitchingState] = useState({
    isPhotoSelected: false,
    startIndexWhenSwitching: 0,
  });

  const onSwitchMode = (index: number) => {
    setSwitchingState((s) => ({
      isPhotoSelected: !s.isPhotoSelected,
      startIndexWhenSwitching: index,
    }));
  };

  return (
    <View style={styles.viewStyle}>
      {!switchingState.isPhotoSelected ? (
        <PhotoGrid
          contextSource={props.contextSource}
          startIndex={switchingState.startIndexWhenSwitching}
          onSwitchMode={onSwitchMode}
        />
      ) : (
        <PhotoSlider
          contextSource={props.contextSource}
          startIndex={switchingState.startIndexWhenSwitching}
          onSwitchMode={onSwitchMode}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    margin: 1,
  },
});
