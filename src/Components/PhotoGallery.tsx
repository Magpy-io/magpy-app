import {
  StyleSheet,
  View,
  FlatList,
  BackHandler,
  ViewToken,
} from "react-native";

import { useEffect, useState, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { PhotoType } from "~/Helpers/types";
import PhotoGrid from "~/Components/PhotoGrid";
import PhotoSlider from "~/Components/PhotoSlider";

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

const ITEMS_TO_LOAD_PER_END_REACHED = 200;

export default function PhotoGallery(props: PropsType) {
  console.log("PhotoGallery: Render");
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [switchingState, setSwitchingState] = useState({
    isPhotoSelected: false,
    startIndexWhenSwitching: 0,
  });
  const nextOffset = useRef(0);
  const isFetching = useRef(false);

  const fetchMore = useCallback(async () => {
    console.log(`PhotoGallery: fetchMore : nextOffset: ${nextOffset.current}`);
    if (!isFetching.current) {
      isFetching.current = true;
      const newPhotos = await props.loadMore(
        ITEMS_TO_LOAD_PER_END_REACHED,
        nextOffset.current
      );

      nextOffset.current = newPhotos.nextOffset;
      isFetching.current = false;
      setPhotos([...photos, ...newPhotos.photos]);

      console.log(
        `PhotoGallery: fetchMore: Fetch successful, nextOffset : ${nextOffset.current}`
      );
    } else {
      console.log(
        "PhotoGallery: fetchMore: A fetch is already in progress, exiting."
      );
    }
  }, [isFetching, photos, nextOffset]);

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
          onEndReached={fetchMore}
          onSwitchMode={onSwitchMode}
          startIndex={switchingState.startIndexWhenSwitching}
        />
      ) : (
        <PhotoSlider
          photos={photos}
          onEndReached={fetchMore}
          onSwitchMode={onSwitchMode}
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
