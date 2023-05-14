import { StyleSheet, View } from "react-native";

import { useCallback, useState } from "react";
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
  refreshPhotosAddingServer?: () => Promise<void>;
};

export default function PhotoGallery(props: PropsType) {
  console.log("render gallery", props.contextLocation);
  const [switchingState, setSwitchingState] = useState({
    isPhotoSelected: false,
    startIndexWhenSwitching: 0,
  });

  const onSwitchMode = useCallback(
    (isPhotoSelected: boolean, index: number) => {
      setSwitchingState((s) => {
        if (
          s.isPhotoSelected != isPhotoSelected ||
          s.startIndexWhenSwitching != index
        ) {
          return {
            isPhotoSelected: isPhotoSelected,
            startIndexWhenSwitching: index,
          };
        } else {
          return s;
        }
      });
    },
    []
  );

  return (
    <View style={styles.viewStyle}>
      {switchingState.isPhotoSelected ? (
        <View style={styles.viewStyle}>
          <PhotoSlider
            key={"photo_slider_" + props.contextLocation}
            id={"photo_slider_" + props.contextLocation}
            contextLocation={props.contextLocation}
            isSliding={switchingState.isPhotoSelected}
            style={{}}
            photos={props.photos}
            startIndex={switchingState.startIndexWhenSwitching}
            onSwitchMode={onSwitchMode}
            RequestFullPhoto={props.RequestFullPhoto}
            fetchMore={props.fetchMore}
            addPhotoLocal={(photo: PhotoType) =>
              props.addPhotosLocal?.([photo])
            }
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
            id={"photo_grid_" + props.contextLocation}
            contextLocation={props.contextLocation}
            style={{}}
            photos={props.photos}
            startIndex={switchingState.startIndexWhenSwitching}
            onSwitchMode={onSwitchMode}
            fetchMore={props.fetchMore}
            onRefresh={props.onRefresh}
            addPhotosServer={props.addPhotosServer}
            addPhotosLocal={props.addPhotosLocal}
            deletePhotosLocal={props.deletePhotosLocal}
            deletePhotosServer={props.deletePhotosServer}
            headerDisplayTextFunction={props.gridHeaderTextFunction}
            refreshPhotosAddingServer={props.refreshPhotosAddingServer}
          />
        </View>
      ) : (
        <View style={styles.viewStyle}>
          <PhotoGrid
            key={"photo_grid_" + props.contextLocation}
            id={"photo_grid_" + props.contextLocation}
            contextLocation={props.contextLocation}
            style={{}}
            photos={props.photos}
            startIndex={switchingState.startIndexWhenSwitching}
            onSwitchMode={onSwitchMode}
            fetchMore={props.fetchMore}
            onRefresh={props.onRefresh}
            addPhotosServer={props.addPhotosServer}
            addPhotosLocal={props.addPhotosLocal}
            deletePhotosLocal={props.deletePhotosLocal}
            deletePhotosServer={props.deletePhotosServer}
            headerDisplayTextFunction={props.gridHeaderTextFunction}
            refreshPhotosAddingServer={props.refreshPhotosAddingServer}
          />
          <PhotoSlider
            key={"photo_slider_" + props.contextLocation}
            id={"photo_slider_" + props.contextLocation}
            contextLocation={props.contextLocation}
            isSliding={switchingState.isPhotoSelected}
            style={{}}
            photos={props.photos}
            startIndex={switchingState.startIndexWhenSwitching}
            onSwitchMode={onSwitchMode}
            RequestFullPhoto={props.RequestFullPhoto}
            fetchMore={props.fetchMore}
            addPhotoLocal={(photo: PhotoType) =>
              props.addPhotosLocal?.([photo])
            }
            addPhotoServer={(photo: PhotoType) =>
              props.addPhotosServer?.([photo])
            }
            deletePhotoLocal={props.deletePhotoLocal}
            deletePhotoServer={(photo: PhotoType) =>
              props.deletePhotosServer?.([photo])
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "100%",
  },
});
