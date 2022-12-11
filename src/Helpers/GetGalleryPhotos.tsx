import { CameraRoll } from "@react-native-camera-roll/camera-roll";

function GetPhotosUris(n: number) {
  return CameraRoll.getPhotos({
    first: n,
    assetType: "Photos",
  }).then((r) => {
    return r.edges.map((edge) => edge.node.image.uri);
  });
}

export default GetPhotosUris;
