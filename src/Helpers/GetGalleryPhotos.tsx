import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFS from "react-native-fs";

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

async function RemovePhoto(uri: string) {
  //return CameraRoll.deletePhotos([uri]);

  const s = uri.split("///").pop() ?? "";
  console.log(s);
  const exists = await RNFS.exists(s);

  if (exists) {
    await RNFS.unlink(s);
    console.log("file unliked");
  } else {
    console.log("file does not exist");
  }
}

export { GetPhotos, RemovePhoto };
