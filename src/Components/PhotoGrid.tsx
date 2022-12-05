import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  PermissionsAndroid,
  View,
  Button,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import RNFS from "react-native-fs";

type PhotoGridProps = {};

// async function selectPhoto(){

//     const options = {
//         mediaType: 'photo',
//     }
//     const result = await launchImageLibrary(options);
//     console.log("result", result)
// }

export default function PhotoGrid(props: PhotoGridProps) {
  const [downloadsFolder, setDownloadsFolder] = useState("");
  const [documentsFolder, setDocumentsFolder] = useState("");
  const [externalDirectory, setExternalDirectory] = useState("");

  useEffect(() => {
    //get user's file paths from react-native-fs
    setDownloadsFolder(RNFS.DownloadDirectoryPath);
    setDocumentsFolder(RNFS.DocumentDirectoryPath); //alternative to MainBundleDirectory.
    setExternalDirectory(RNFS.ExternalStorageDirectoryPath);
  }, []);

  return (
    <View>
      <Text>test</Text>
      {/* <Button
                title="select photo"
                onPress={selectPhoto}
            /> */}
      <Text> Downloads Folder: {downloadsFolder}</Text>
      <Text>Documents folder: {documentsFolder}</Text>
      <Text>External storage: {externalDirectory}</Text>
    </View>
  );
}
