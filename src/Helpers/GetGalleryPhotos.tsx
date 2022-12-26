import { CameraRoll } from "@react-native-camera-roll/camera-roll";

function GetPhotos(n: number, offset: number = 0) {
  return CameraRoll.getPhotos({
    first: n,
    after: String(offset),
    assetType: "Photos",
    include: ["fileSize", "filename", "imageSize"],
  }).then((r) => {
    return { edges: r.edges, endReached: !r.page_info.has_next_page };
  });
}

export default GetPhotos;
