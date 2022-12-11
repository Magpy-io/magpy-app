import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";

import { Image } from "react-native-elements";

type PhotoGridProps = {
  uris?: Array<string>;
  title?: string;
  onPhotoClicked?: (index: number) => void;
};

const RenderItem = ({
  item,
  index,
  onItemClicked,
}: {
  item: any;
  index: number;
  onItemClicked: (index: number) => void;
}) => (
  <TouchableWithoutFeedback
    onPress={() => {
      onItemClicked(index);
    }}
  >
    <View style={styles.itemStyle}>
      <Image
        source={{
          uri: item,
        }}
        height={"auto"}
        width={"auto"}
        style={[styles.imageStyle]}
        containerStyle={styles.imageContainerStyle}
      />
    </View>
  </TouchableWithoutFeedback>
);

export default function PhotoGrid(props: PhotoGridProps) {
  const PhotoPressed = props.onPhotoClicked
    ? props.onPhotoClicked
    : (n: number) => {};
  return (
    <View style={styles.viewStyle}>
      <FlatList
        style={styles.flatListStyle}
        data={props.uris}
        renderItem={({ item, index }) =>
          RenderItem({ item, index, onItemClicked: PhotoPressed })
        }
        keyExtractor={(item, i) => String(i)}
        numColumns={3}
        ListHeaderComponent={() =>
          props.title ? (
            <Text style={styles.titleStyle}>{props.title}</Text>
          ) : null
        }
      />
    </View>
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
  itemTextStyle: { textAlign: "center" },
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: BORDER_RADIUS,
  },
  imageContainerStyle: { overflow: "hidden" },
});
