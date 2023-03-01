import { StyleSheet, View } from "react-native";

import { useState, useRef, useCallback } from "react";
import { PhotoType } from "~/Helpers/types";
import PhotoGrid from "~/Components/PhotoGrid";
import PhotoSlider from "~/Components/PhotoSlider";
import { postPhoto, getPhotoById } from "~/Helpers/Queries";
import RNFS from "react-native-fs";

const postPhotoHelper = (photo: PhotoType) => {
  RNFS.readFile(photo.image.path, "base64")
    .then((res: string) => {
      postPhoto({
        name: photo.image.fileName,
        fileSize: photo.image.fileSize,
        width: photo.image.width,
        height: photo.image.height,
        date: new Date(photo.created).toJSON(),
        path: photo.image.path,
        image64: res,
      });
    })
    .catch((err: any) => console.log(err));
};

type PropsType = {
  loadMore: (
    count: number,
    offset: number
  ) => Promise<{
    photos: PhotoType[];
    nextOffset: number;
    endReached: boolean;
  }>;
  title?: string;
};

const ITEMS_TO_LOAD_PER_END_REACHED = 100;

export default function PhotoGallery(props: PropsType) {
  console.log("PhotoGallery: Render");
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [switchingState, setSwitchingState] = useState({
    isPhotoSelected: false,
    startIndexWhenSwitching: 0,
  });
  const nextOffset = useRef(0);
  const isFetching = useRef(false);
  const endReached = useRef(false);

  const RequestFullPhotoCallback = useCallback(
    (index: number) => {
      getPhotoById(photos[index].id)
        .then((r) => {
          const newPhotos = [...photos];
          newPhotos[
            index
          ].image.image64Full = `data:image/jpeg;base64,${r.data.photo.image64}`;
          setPhotos(newPhotos);
        })
        .catch((err: any) => console.log(err));
    },
    [photos]
  );

  const fetchMoreCallback = useCallback(async () => {
    if (endReached.current) {
      console.log(`PhotoGallery: fetchMore : end reached.`);
      return;
    }

    if (!isFetching.current) {
      console.log(
        `PhotoGallery: fetchMore : nextOffset: ${nextOffset.current}`
      );
      isFetching.current = true;
      const newPhotos = await props.loadMore(
        ITEMS_TO_LOAD_PER_END_REACHED,
        nextOffset.current
      );

      nextOffset.current = newPhotos.nextOffset;
      isFetching.current = false;
      endReached.current = newPhotos.endReached;
      setPhotos([...photos, ...newPhotos.photos]);

      console.log(
        `PhotoGallery: fetchMore: Fetch successful, fetched : ${newPhotos.photos.length}, nextOffset : ${nextOffset.current}`
      );
    } else {
      console.log(
        "PhotoGallery: fetchMore: A fetch is already in progress, exiting."
      );
    }
  }, [isFetching, photos, nextOffset, endReached]);

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
          photos={photos}
          onEndReached={fetchMoreCallback}
          onSwitchMode={onSwitchMode}
          onPostPhoto={postPhotoHelper}
          startIndex={switchingState.startIndexWhenSwitching}
        />
      ) : (
        <PhotoSlider
          photos={photos}
          onEndReached={fetchMoreCallback}
          onSwitchMode={onSwitchMode}
          onPostPhoto={postPhotoHelper}
          RequestFullPhoto={RequestFullPhotoCallback}
          startIndex={switchingState.startIndexWhenSwitching}
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
