import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { DeleteMedia } from "react-native-delete-media";
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

async function getFirstPossibleFileName(path: string) {
  if (!(await RNFS.exists(path))) {
    return path;
  }
  const pathSplitted = path.split(".");
  const extension = pathSplitted.pop();
  const pathWithoutExtension = pathSplitted.join("");

  let exists = true;
  let currentPath = path;
  let i = 1;
  while (exists) {
    currentPath = pathWithoutExtension + ` (${i++}).` + extension;
    exists = await RNFS.exists(currentPath);
  }
  return currentPath;
}

function addPhoto(path: string, image: string) {
  return RNFS.writeFile(path, image, "base64");
}

async function RemovePhotos(uris: string[]) {
  const urisThatExist = [];
  for (let i = 0; i < uris.length; i++) {
    if (await RNFS.exists(uris[i])) {
      urisThatExist.push(uris[i]);
    }
  }

  if (urisThatExist.length == 0) {
    return;
  }

  return DeleteMedia.deletePhotos(urisThatExist);
}

export { GetPhotos, RemovePhotos, addPhoto, getFirstPossibleFileName };
