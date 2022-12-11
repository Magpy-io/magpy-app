import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import codegenNativeCommands from "react-native/Libraries/Utilities/codegenNativeCommands";

function GetPhotos(n: number) {
  return CameraRoll.getPhotos({
    first: n,
    assetType: "Photos",
    include: ["fileSize", "filename", "imageSize"],
  }).then((r) => {
    return r.edges.map((edge) => edge.node.image);
  });
}

export default GetPhotos;
