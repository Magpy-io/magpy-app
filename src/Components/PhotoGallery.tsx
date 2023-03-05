import { StyleSheet, View, Platform } from "react-native";

import { useState, useRef, useCallback } from "react";
import { PhotoType } from "~/Helpers/types";
import PhotoGrid from "~/Components/PhotoGrid";
import PhotoSlider from "~/Components/PhotoSlider";
import { postPhoto, getPhotoById } from "~/Helpers/Queries";
import RNFS from "react-native-fs";

function urlToFilePath(url: string) {
  let filePath = url;
  if (Platform.OS === "android" && url.startsWith("file:///")) {
    filePath = url.replace("file://", "");
  }
  return decodeURI(filePath);
}

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

  const deletePhotoCallback = useCallback(
    (index: number) => {
      const photo = photos[index];
      RNFS.unlink(urlToFilePath(photo.image.path))
        .then((r) => {
          const newPhotos = [...photos];
          newPhotos[index].inDevice = false;
          setPhotos(newPhotos);
        })
        .then(() => {})
        .catch((err: any) => console.log(err));
    },
    [photos]
  );

  const postPhotoCallback = useCallback(
    (index: number) => {
      const photo = photos[index];
      RNFS.readFile(photo.image.path, "base64")
        .then((res: string) => {
          return postPhoto({
            name: photo.image.fileName,
            fileSize: photo.image.fileSize,
            width: photo.image.width,
            height: photo.image.height,
            date: new Date(photo.created).toJSON(),
            path: photo.image.path,
            image64: res,
          });
        })
        .then((r) => {
          const newPhotos = [...photos];
          newPhotos[index].inServer = true;
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
      endReached.current = newPhotos.endReached;
      isFetching.current = false;
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

  const onRefresh = useCallback(async () => {
    if (!isFetching.current) {
      console.log(`PhotoGallery: onRefresh`);
      isFetching.current = true;
      const newPhotos = await props.loadMore(ITEMS_TO_LOAD_PER_END_REACHED, 0);

      nextOffset.current = newPhotos.nextOffset;
      endReached.current = newPhotos.endReached;
      isFetching.current = false;
      setPhotos(newPhotos.photos);

      console.log(
        `PhotoGallery: onRefresh: Fetch successful, fetched : ${newPhotos.photos.length}, nextOffset : ${nextOffset.current}`
      );
    } else {
      console.log(
        "PhotoGallery: onRefresh: A fetch is already in progress, exiting."
      );
    }
  }, []);

  return (
    <View style={styles.viewStyle}>
      {!switchingState.isPhotoSelected ? (
        <PhotoGrid
          photos={photos}
          onEndReached={fetchMoreCallback}
          onSwitchMode={onSwitchMode}
          onPostPhoto={postPhotoCallback}
          onRefresh={onRefresh}
          startIndex={switchingState.startIndexWhenSwitching}
        />
      ) : (
        <PhotoSlider
          photos={photos}
          onEndReached={fetchMoreCallback}
          onSwitchMode={onSwitchMode}
          onPostPhoto={postPhotoCallback}
          RequestFullPhoto={RequestFullPhotoCallback}
          startIndex={switchingState.startIndexWhenSwitching}
          onDeleteAddServer={postPhotoCallback}
          onDeleteAddLocal={deletePhotoCallback}
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
