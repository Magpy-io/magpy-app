import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";

import { Image } from "react-native-elements";
import { Button, Overlay } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

type PhotoGridProps = {
  uris?: Array<string>;
  title?: string;
  onPhotoClicked?: (index: number) => void;
};

type PhotoComponentProps = {
  uri: string;
  onPress: ()=>void;
}

function PhotoComponent(props: PhotoComponentProps){

  const navigation = useNavigation();

  return(
    <TouchableWithoutFeedback
    onPress={()=>{
      // props?.onPress();
      navigation.navigate('PhotoStackNavigator', { screen: 'PhotoPage', params: {
        uri: props.uri
      }});
    }}
  >
    <View style={styles.itemStyle}>
      <Image
        source={{
          uri: props.uri,
        }}
        height={"auto"}
        width={"auto"}
        style={[styles.imageStyle]}
        containerStyle={styles.imageContainerStyle}
      />
    </View>
  </TouchableWithoutFeedback>
  )
}

export default function PhotoGrid(props: PhotoGridProps) {
  const PhotoPressed = props.onPhotoClicked
    ? props.onPhotoClicked
    : (n: number) => {};
  return (
    <View style={styles.viewStyle}>
      <FlatList
        style={styles.flatListStyle}
        data={props.uris}
        renderItem={({item, index})=><PhotoComponent uri={item} onPress={()=>PhotoPressed(index)} />}
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
