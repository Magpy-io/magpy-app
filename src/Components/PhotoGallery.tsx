import { StyleSheet, View } from "react-native";

import { useState } from "react";
import PhotoGrid from "~/Components/PhotoGrid";
import PhotoSlider from "~/Components/PhotoSlider";
import { PhotoType } from "~/Helpers/types";

type PropsType = {
  photos: Array<PhotoType>;
  onRefresh: () => void;
  RequestFullPhoto: (index: number) => void;
  fetchMore?: () => void;
  addPhotoLocal?: (index: number) => void;
  addPhotoServer?: (index: number) => void;
  deletePhotoLocal?: (index: number) => void;
  deletePhotoServer?: (index: number) => void;
};

export default function PhotoGallery(props: PropsType) {
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
          photos={props.photos}
          startIndex={switchingState.startIndexWhenSwitching}
          onSwitchMode={onSwitchMode}
          fetchMore={props.fetchMore}
          onRefresh={props.onRefresh}
        />
      ) : (
        <PhotoSlider
          photos={props.photos}
          startIndex={switchingState.startIndexWhenSwitching}
          onSwitchMode={onSwitchMode}
          RequestFullPhoto={props.RequestFullPhoto}
          fetchMore={props.fetchMore}
          addPhotoLocal={props.addPhotoLocal}
          addPhotoServer={props.addPhotoServer}
          deletePhotoLocal={props.deletePhotoLocal}
          deletePhotoServer={props.deletePhotoServer}
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
