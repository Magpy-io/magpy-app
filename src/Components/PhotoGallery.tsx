import { StyleSheet, View } from "react-native";

import { useCallback, useState } from "react";
import PhotoGrid from "~/Components/PhotoGrid";
import PhotoSlider from "~/Components/PhotoSlider";
import { PhotoType } from "~/Helpers/types";

type PropsType = {
  photos: Array<PhotoType>;
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
    isPhotoSelected: false,
    startIndexWhenSwitching: 0,
  });

  const onSwitchMode = useCallback((index: number) => {
    setSwitchingState((s) => ({
      isPhotoSelected: !s.isPhotoSelected,
      startIndexWhenSwitching: index,
    }));
  }, []);

  return (
    <View style={styles.viewStyle}>
      {!switchingState.isPhotoSelected ? (
        <PhotoGrid
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
      ) : (
        <PhotoSlider
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
