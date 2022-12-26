import { useEffect, useState, useCallback, useRef } from "react";

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  BackHandler,
  Modal,
  StatusBar,
  Button,
  TouchableHighlight,
} from "react-native";

import FastImage from "react-native-fast-image";
import { Image } from "react-native-elements";
import { Overlay } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { PhotoType } from "~/Helpers/types";
import { IndexedAccessType } from "@babel/types";
import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar,
} from "react-native-navigation-bar-color";
import SystemNavigationBar from "react-native-system-navigation-bar";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

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
  onPhotoClicked?: (index: PhotoType) => void;
};

const ItemsToLoadPerEndReached = 200;

export default function PhotoGrid(props: PhotoGridProps) {
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [nextOffset, setNextOffset] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<Boolean>(false);

  const [pressedPhotoIndex, setPressedPhotoIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<Boolean>(false);

  console.log("Render PhotoGrid");

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

  const PhotoPressed = props.onPhotoClicked
    ? props.onPhotoClicked
    : (n: PhotoType) => {};

  function onRefresh() {
    if (!isFetching) {
      setIsFetching(true);
      props.loadMore(ItemsToLoadPerEndReached, 0).then((newPhotos) => {
        setPhotos(newPhotos.photos);
        setNextOffset(newPhotos.nextOffset);
        setIsFetching(false);
      });
    }
  }

  function onGridEndReached() {
    if (!isFetching) {
      setIsFetching(true);
      props.loadMore(ItemsToLoadPerEndReached, nextOffset).then((newPhotos) => {
        setPhotos([...photos, ...newPhotos.photos]);
        setNextOffset(newPhotos.nextOffset);
        setIsFetching(false);
      });
    }
  }

  function onSliderEndReached() {
    if (!isFetching) {
      setIsFetching(true);
      props.loadMore(ItemsToLoadPerEndReached, nextOffset).then((newPhotos) => {
        setPhotos([...photos, ...newPhotos.photos]);
        setNextOffset(newPhotos.nextOffset);
        setIsFetching(false);
      });
    }
  }

  const renderItem = ({ item, index }: { item: PhotoType; index: number }) => (
    <PhotoComponent
      photo={item}
      onPress={() => {
        // PhotoPressed(photos[index])
        setPressedPhotoIndex(index);
        setModalVisible(true);
      }}
    />
  );

  return (
    <>
      <View style={styles.viewStyle}>
        <FlatList
          key={"flatList1"}
          style={styles.flatListStyle}
          data={photos}
          renderItem={renderItem}
          maxToRenderPerBatch={20}
          initialNumToRender={20}
          keyExtractor={(item, index) =>
            `Photo_${item.image.fileName}_index_${index}`
          }
          onEndReachedThreshold={20}
          onEndReached={onGridEndReached}
          onRefresh={onRefresh}
          refreshing={false}
          numColumns={3}
          ListHeaderComponent={() =>
            props.title ? (
              <Text style={styles.titleStyle}>{props.title}</Text>
            ) : null
          }
        />

        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <PhotoSlider
            photos={photos}
            onEndReached={onSliderEndReached}
            pressedPhotoIndex={pressedPhotoIndex}
          />
        </Modal>
      </View>
    </>
  );
}

type PhotoComponentProps = {
  photo: PhotoType;
  onPress: () => void;
};

function PhotoComponent(props: PhotoComponentProps) {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props?.onPress();
        // navigation.navigate("PhotoStackNavigator", {
        //   screen: "PhotoPage",
        //   params: {
        //     photo: props.photo,
        //   },
        // });
      }}
    >
      <View style={styles.itemStyle}>
        <FastImage
          source={{
            uri: props.photo.inDevice
              ? props.photo.image.path
              : props.photo.image.image64,
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={[styles.imageStyle]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

type PhotoSliderProps = {
  photos: PhotoType[];
  onEndReached: () => void;
  pressedPhotoIndex: number;
};

function PhotoSlider(props: PhotoSliderProps) {
  return (
    <FlatList
      key={"flatList2"}
      style={styles.flatListStyle}
      data={props.photos}
      renderItem={({ item, index }) => (
        <PhotoComponentHorizontal photo={item} />
      )}
      horizontal
      snapToAlignment="start"
      disableIntervalMomentum
      decelerationRate={"normal"}
      showsHorizontalScrollIndicator={false}
      snapToInterval={Dimensions.get("screen").width}
      keyExtractor={(item, index) =>
        `Photo_${item.image.fileName}_index_${index}`
      }
      onEndReachedThreshold={20}
      initialNumToRender={20}
      onEndReached={props.onEndReached}
      getItemLayout={(data, index) => ({
        length: windowWidth,
        offset: windowWidth * index,
        index,
      })}
      initialScrollIndex={props.pressedPhotoIndex}
    />
  );
}

function PhotoComponentHorizontal(props: { photo: PhotoType }) {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <View style={styles.itemHorizontalStyle}>
        <FastImage
          source={{
            uri: props.photo.inDevice
              ? props.photo.image.path
              : props.photo.image.image64,
          }}
          resizeMode={FastImage.resizeMode.contain}
          style={[styles.imageStyle]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const MARGIN = 1;
const BORDER_RADIUS = 0;

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
    color: "grey",
    paddingBottom: 15,
  },
  viewStyle: {
    flex: 1,
    margin: MARGIN,
  },
  flatListStyle: {},
  itemStyle: {
    padding: MARGIN,
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
  },
  itemHorizontalStyle: {
    padding: MARGIN,
    justifyContent: "center",
    width: Dimensions.get("screen").width,
  },
  itemTextStyle: { textAlign: "center" },
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: BORDER_RADIUS,
  },
  imageContainerStyle: { overflow: "hidden" },
});
