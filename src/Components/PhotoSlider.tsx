import { StyleSheet, BackHandler } from "react-native";

import { useCallback, useEffect, useRef, useState } from "react";
import { PhotoType } from "~/Helpers/types";
import StatusBarComponent from "./PhotoComponents/StatusBarComponent";
import ToolBar from "./PhotoComponents/ToolBar";
import PhotoSliderCore from "./PhotoSliderCore";

import {
  ContextSourceTypes,
  useSelectedContext,
} from "~/Components/ContextProvider";

type PropsType = {
  contextSource: ContextSourceTypes;
  startIndex: number;
  onSwitchMode: (index: number) => void;
  onPhotoClick?: (index: number) => void;
  onPhotoLongClick?: (index: number) => void;
};

export default function PhotoSlider(props: PropsType) {
  const context = useSelectedContext(props.contextSource);
  const flatListCurrentIndexRef = useRef<number>(props.startIndex);
  const [flatListCurrentIndex, setFlatListCurrentIndex] = useState(
    props.startIndex
  );

  const validFlatListCurrentIndex =
    context.photos.length != 0 && flatListCurrentIndex < context.photos.length;

  useEffect(() => {
    if (
      validFlatListCurrentIndex &&
      !context.photos[flatListCurrentIndex].inDevice
    ) {
      context.RequestFullPhoto(flatListCurrentIndex);
    }
  }, [context.photos, flatListCurrentIndex, validFlatListCurrentIndex]);

  const onCurrentIndexChanged = useCallback((index: number) => {
    flatListCurrentIndexRef.current = index;
    setFlatListCurrentIndex(index);
  }, []);

  useEffect(() => {
    const backAction = () => {
      props.onSwitchMode(flatListCurrentIndexRef.current);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [props.onSwitchMode]);

  return (
    <>
      <PhotoSliderCore
        photos={context.photos}
        startIndex={props.startIndex}
        onSwitchMode={props.onSwitchMode}
        onIndexChanged={onCurrentIndexChanged}
        onEndReached={context.fetchMore}
      />
      {validFlatListCurrentIndex ? (
        <StatusBarComponent
          style={styles.statusBarStyle}
          inDevice={context.photos[flatListCurrentIndex].inDevice}
          inServer={context.photos[flatListCurrentIndex].inServer}
          onBackButton={() => props.onSwitchMode(flatListCurrentIndex)}
        />
      ) : (
        <></>
      )}

      {validFlatListCurrentIndex ? (
        <ToolBar
          style={styles.toolBarStyle}
          inDevice={context.photos[flatListCurrentIndex].inDevice}
          inServer={context.photos[flatListCurrentIndex].inServer}
          onAddLocal={() => context.addPhotoLocal(flatListCurrentIndex)}
          onAddServer={() => context.addPhotoServer(flatListCurrentIndex)}
          onDeleteLocal={() => context.deletePhotoLocal(flatListCurrentIndex)}
          onDeleteServer={() => context.deletePhotoServer(flatListCurrentIndex)}
        />
      ) : (
        <></>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  centeringViewStyle: {
    backgroundColor: "white",
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  flatListStyle: { backgroundColor: "white" },
  statusBarStyle: { position: "absolute", top: 0 },
  toolBarStyle: { position: "absolute", bottom: 0 },
});
