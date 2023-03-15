import { StyleSheet, View, Platform } from "react-native";

import { useState, useRef, useCallback } from "react";
import { PhotoType } from "~/Helpers/types";
import PhotoGrid from "~/Components/PhotoGrid";
import PhotoSlider from "~/Components/PhotoSlider";
import { postPhoto, getPhotoById, removePhotoById } from "~/Helpers/Queries";
import { addPhoto, RemovePhoto } from "~/Helpers/GetGalleryPhotos";
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
      if (photos[index].image.image64Full) {
        return;
      }
      return getPhotoById(photos[index].id)
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
      if (photo.inServer) {
        RequestFullPhotoCallback(index);
      }

      return RemovePhoto(photo.image.path)
        .then(() => {
          if (photo.inServer) {
            const newPhotos = [...photos];
            newPhotos[index].inDevice = false;
            setPhotos(newPhotos);
          } else {
            const newPhotos = [...photos];
            newPhotos.splice(index, 1);
            setPhotos(newPhotos);
            setSwitchingState(
              ({ isPhotoSelected, startIndexWhenSwitching }) => {
                return {
                  isPhotoSelected: isPhotoSelected,
                  startIndexWhenSwitching:
                    index < photos.length ? index : photos.length - 1,
                };
              }
            );
          }
        })
        .catch((err: any) => console.log(err));
    },
    [photos]
  );

  const addPhotoLocalCallback = useCallback(
    (index: number) => {
      const photo = photos[index];

      return addPhoto(
        photo.image.path,
        photo.image.image64Full.split("data:image/jpeg;base64,")[1]
      ).then(() => {
        const newPhotos = [...photos];
        newPhotos[index].inDevice = true;
        setPhotos(newPhotos);
      });
    },
    [photos]
  );

  const deleteAddLocalCallback = useCallback(
    (index: number) => {
      if (index >= photos.length) {
        return;
      }

      const photo = photos[index];
      if (photo.inDevice) {
        return deletePhotoCallback(index);
      } else {
        return addPhotoLocalCallback(index);
      }
    },
    [deletePhotoCallback, addPhotoLocalCallback, photos]
  );

  const postPhotoCallback = useCallback(
    (index: number) => {
      const photo = photos[index];
      return RNFS.readFile(photo.image.path, "base64")
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
        .then((response: any) => {
          const newPhotos = [...photos];
          newPhotos.splice(index, 1);
          setPhotos(newPhotos);
          setSwitchingState(({ isPhotoSelected, startIndexWhenSwitching }) => {
            return {
              isPhotoSelected: isPhotoSelected,
              startIndexWhenSwitching:
                index < photos.length ? index : photos.length - 1,
            };
          });
        })
        .catch((err: any) => console.log(err));
    },
    [photos]
  );

  const removePhotoFromServerCallback = useCallback(
    (index: number) => {
      const photo = photos[index];
      return removePhotoById(photo.id)
        .then(() => {
          const newPhotos = [...photos];
          newPhotos.splice(index, 1);
          setPhotos(newPhotos);
          setSwitchingState(({ isPhotoSelected, startIndexWhenSwitching }) => {
            return {
              isPhotoSelected: isPhotoSelected,
              startIndexWhenSwitching:
                index < newPhotos.length ? index : newPhotos.length - 1,
            };
          });
        })
        .catch((err: any) => console.log(err));
    },
    [photos]
  );

  const deleteAddServerCallback = useCallback(
    (index: number) => {
      const photo = photos[index];
      if (photo.inServer) {
        return removePhotoFromServerCallback(index);
      } else {
        return postPhotoCallback(index);
      }
    },
    [postPhotoCallback, removePhotoFromServerCallback, photos]
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
          onDeleteAddServer={deleteAddServerCallback}
          onDeleteAddLocal={deleteAddLocalCallback}
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
