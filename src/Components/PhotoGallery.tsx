import { StyleSheet, View } from "react-native";

import { useCallback, useEffect, useState } from "react";
import PhotoGrid from "~/Components/PhotoGrid";
import PhotoSlider from "~/Components/PhotoSlider";
import { PhotoType } from "~/Helpers/types";

type PropsType = {
  photos: PhotoType[];
  onRefresh: () => void;
  contextLocation: string;
  RequestFullPhoto: (photo: PhotoType) => void;
  fetchMore?: () => void;
  addPhotosLocal?: (photos: PhotoType[]) => void;
  addPhotosServer?: (photos: PhotoType[]) => void;
  deletePhotosLocal?: (photos: PhotoType[]) => void;
  deletePhotoLocal?: (photo: PhotoType) => void;
  deletePhotosServer?: (photos: PhotoType[]) => void;
  gridHeaderTextFunction?: (photosNb: number) => string;
};

export default function PhotoGallery(props: PropsType) {
  const [switchingState, setSwitchingState] = useState({
    isPhotoSelected: true,
    startIndexWhenSwitching: 0,
  });

  const onSwitchMode = useCallback((index: number) => {
    setSwitchingState((s) => ({
      isPhotoSelected: !s.isPhotoSelected,
      startIndexWhenSwitching: index,
    }));
  }, []);

  useEffect(() => {
    console.log("gallery render");
  }, [props.photos]);

  return (
    <View style={styles.viewStyle}>
      <View style={{ backgroundColor: "red" }}>
        <PhotoSlider
          key={"photo_slider_" + props.contextLocation}
          style={{ top: 0 }}
          photos={props.photos}
          startIndex={switchingState.startIndexWhenSwitching}
          onSwitchMode={onSwitchMode}
          RequestFullPhoto={props.RequestFullPhoto}
          fetchMore={props.fetchMore}
          addPhotoLocal={(photo: PhotoType) => props.addPhotosLocal?.([photo])}
          addPhotoServer={(photo: PhotoType) =>
            props.addPhotosServer?.([photo])
          }
          deletePhotoLocal={props.deletePhotoLocal}
          deletePhotoServer={(photo: PhotoType) =>
            props.deletePhotosServer?.([photo])
          }
        />
        <PhotoGrid
          key={"photo_grid_" + props.contextLocation}
          style={{ top: 0 }}
          photos={props.photos}
          startIndex={switchingState.startIndexWhenSwitching}
          contextLocation={props.contextLocation}
          onSwitchMode={onSwitchMode}
          fetchMore={props.fetchMore}
          onRefresh={props.onRefresh}
          addPhotosServer={props.addPhotosServer}
          addPhotosLocal={props.addPhotosLocal}
          deletePhotosLocal={props.deletePhotosLocal}
          deletePhotosServer={props.deletePhotosServer}
          headerDisplayTextFunction={props.gridHeaderTextFunction}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    top: 0,
    backgroundColor: "red",
  },
});
