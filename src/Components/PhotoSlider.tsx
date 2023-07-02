import {
  StyleSheet,
  BackHandler,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { PhotoType } from "~/Helpers/types";
import StatusBarComponent from "./PhotoComponents/StatusBarComponent";
import ToolBar from "./PhotoComponents/ToolBar";
import PhotoSliderCore from "./PhotoSliderCore";
import { Text } from "react-native-elements";
import PhotoDetailsModal from "./PhotoDetailsModal";

import { useMainContext } from "~/Components/ContextProvider";

import { NativeModules } from "react-native";
const { MainModule } = NativeModules;

type PropsType = {
  photos: Array<PhotoType>;
  style?: StyleProp<ViewStyle>;
  startIndex: number;
  contextLocation: string;
  id: string;
  isSliding: boolean;
  onSwitchMode: (isPhotoSelected: boolean, index: number) => void;
};

function PhotoSlider(props: PropsType) {
  console.log("render slider", props.contextLocation);

  const context = useMainContext();

  const flatListCurrentIndexRef = useRef<number>(props.startIndex);
  const [flatListCurrentIndex, setFlatListCurrentIndex] = useState(
    props.startIndex
  );
  const [viewDetails, setViewDetails] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const validFlatListCurrentIndex =
    props.photos.length != 0 && flatListCurrentIndex < props.photos.length;

  useEffect(() => {
    if (
      validFlatListCurrentIndex &&
      !props.photos[flatListCurrentIndex].inDevice &&
      props.contextLocation == "server"
    ) {
      context.RequestFullPhotoServer(props.photos[flatListCurrentIndex]);
    }
  }, [
    props.photos,
    props.contextLocation,
    flatListCurrentIndex,
    validFlatListCurrentIndex,
  ]);

  const onCurrentIndexChanged = useCallback((index: number) => {
    flatListCurrentIndexRef.current = index;
    setFlatListCurrentIndex(index);
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (props.isSliding) {
        props.onSwitchMode(false, flatListCurrentIndexRef.current);
        backHandler.remove();
        return true;
      } else {
        return false;
      }
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      return backHandler.remove();
    };
  }, [props.onSwitchMode, props.isSliding]);

  useEffect(() => {
    if (props.photos.length == 0) {
      props.onSwitchMode(false, 0);
    }
  }, [props.photos.length, props.onSwitchMode]);

  return (
    <View style={[styles.mainViewStyle, props.style]}>
      <PhotoSliderCore
        photos={props.photos}
        startIndex={props.startIndex}
        onIndexChanged={onCurrentIndexChanged}
        //onEndReached={}
        onPhotoClick={() => {
          if (isFullScreen) {
            MainModule.disableFullScreen();
          } else {
            MainModule.enableFullScreen();
          }
          setIsFullScreen((f) => !f);
        }}
      />

      {validFlatListCurrentIndex && viewDetails && (
        <View
          style={{
            backgroundColor: "white",
            position: "absolute",
            top: "50%",
            padding: 10,
          }}
        >
          <Text>{`Name: ${props.photos[flatListCurrentIndex].image.fileName}\nPath: ${props.photos[flatListCurrentIndex].image.path}\nTaken: ${props.photos[flatListCurrentIndex].created}\nModified: ${props.photos[flatListCurrentIndex].modified}`}</Text>
        </View>
      )}

      {validFlatListCurrentIndex && !isFullScreen && (
        <StatusBarComponent
          inDevice={props.photos[flatListCurrentIndex].inDevice}
          inServer={props.photos[flatListCurrentIndex].inServer}
          isLoading={props.photos[flatListCurrentIndex].isLoading}
          loadingPercentage={
            props.photos[flatListCurrentIndex].loadingPercentage
          }
          onBackButton={() => props.onSwitchMode(false, flatListCurrentIndex)}
        />
      )}

      {validFlatListCurrentIndex && !isFullScreen && (
        <>
          <ToolBar
            inDevice={props.photos[flatListCurrentIndex].inDevice}
            inServer={props.photos[flatListCurrentIndex].inServer}
            onAddLocal={() =>
              context.addPhotosLocal?.([props.photos[flatListCurrentIndex]])
            }
            onAddServer={() =>
              context.addPhotosServer?.([props.photos[flatListCurrentIndex]])
            }
            onDeleteLocal={() => {
              if (props.contextLocation == "server") {
                context.RequestCroppedPhotosServer([
                  props.photos[flatListCurrentIndex],
                ]);
              }
              context.deletePhotosLocal?.([props.photos[flatListCurrentIndex]]);
            }}
            onDeleteServer={() =>
              context.deletePhotosServer?.([props.photos[flatListCurrentIndex]])
            }
            onDetails={() => {
              setDetailsModalVisible(true);
              console.log("details");
            }}
          />

          <PhotoDetailsModal
            modalVisible={detailsModalVisible}
            handleModal={() => setDetailsModalVisible(!detailsModalVisible)}
            photo={props.photos[flatListCurrentIndex]}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewStyle: {
    height: "100%",
    width: "100%",
  },
});

export default PhotoSlider;
