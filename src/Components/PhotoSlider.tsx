import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  BackHandler,
  ViewToken,
} from "react-native";

import FastImage from "react-native-fast-image";
import { Image } from "react-native-elements";
import { Button, Overlay } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  MutableRefObject,
} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { PhotoType } from "~/Helpers/types";
import PhotoComponentForSlider from "./PhotoComponentForSlider";

type PhotoGridProps = {
  loadMore: (
    count: number,
    offset: number
  ) => Promise<{
    photos: PhotoType[];
    nextOffset: number;
    endReached: boolean;
  }>;
  title?: string;
  onPhotoClicked?: (photo: PhotoType) => void;
};

const ItemsToLoadPerEndReached = 200;

export default function PhotoGrid(props: PhotoGridProps) {
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [nextOffset, setNextOffset] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (photos.length == 0) {
      setIsFetching(true);
      props.loadMore(ItemsToLoadPerEndReached, 0).then((newPhotos) => {
        setPhotos(newPhotos.photos);
        setNextOffset(newPhotos.nextOffset);
        setIsFetching(false);
      });
    }
  }, []);

  const PhotoPressed = props.onPhotoClicked ?? ((photo: PhotoType) => {});

  console.log("Render PhotoSlider");

  return (
    <FlatList
      style={styles.flatListStyle}
      data={photos}
      renderItem={({ item, index }) => (
        <PhotoComponentForSlider
          photo={item}
          onPress={() => PhotoPressed(photos[index])}
        />
      )}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 90,
      }}
      horizontal={true}
      snapToAlignment="start"
      disableIntervalMomentum={true}
      decelerationRate={"normal"}
      showsHorizontalScrollIndicator={false}
      snapToInterval={Dimensions.get("screen").width}
      keyExtractor={(item, index) =>
        `Photo_${item.image.fileName}_index_${index}`
      }
      onEndReachedThreshold={20}
      onEndReached={() => {
        if (!isFetching) {
          setIsFetching(true);
          props
            .loadMore(ItemsToLoadPerEndReached, nextOffset)
            .then((newPhotos) => {
              console.log("photos" + photos.length);
              setPhotos([...photos, ...newPhotos.photos]);
              setNextOffset(newPhotos.nextOffset);
              setIsFetching(false);
            });
        }
      }}
      ListHeaderComponent={() =>
        props.title ? (
          <Text style={styles.titleStyle}>{props.title}</Text>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
    color: "grey",
    paddingBottom: 15,
  },
  flatListStyle: {},
});
