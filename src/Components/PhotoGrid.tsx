import { StyleSheet, Text, View, FlatList } from "react-native";

import { Image } from "react-native-elements";

import colors from "~/colors";

type PhotoGridProps = { uris?: Array<string>; title?: string };

const RenderItem = ({ item, index }: { item: any; index: number }) => (
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
);

export default function PhotoGrid(props: PhotoGridProps) {
  return (
    <View style={styles.viewStyle}>
      <FlatList
        style={styles.flatListStyle}
        data={props.uris}
        renderItem={RenderItem}
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
    color: colors.grey,
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
