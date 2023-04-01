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

async function addPhoto(
  imageName: string,
  source: { image64?: string; pathCache?: string }
) {
  if (source.image64) {
    const cachePhotoPath = RNFS.ExternalCachesDirectoryPath + `/${imageName}`;
    await RNFS.writeFile(cachePhotoPath, source.image64, "base64");
    await CameraRoll.save(cachePhotoPath, { album: "Restored" });
    await RNFS.unlink(cachePhotoPath);
  } else if (source.pathCache) {
    await CameraRoll.save(source.pathCache, { album: "Restored" });
    await RNFS.unlink(source.pathCache);
  } else {
    throw "addPhoto no image provided";
  }
  const dirPath = "/storage/emulated/0/DCIM/Restored/";
  return "file://" + dirPath + imageName;
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

async function addPhotoToCache(imageName: string, image: string) {
  const cachePhotoPath = RNFS.ExternalCachesDirectoryPath + `/${imageName}`;
  await RNFS.writeFile(cachePhotoPath, image, "base64");
  return "file://" + cachePhotoPath;
}

async function clearCache() {
  const results = await RNFS.readDir(RNFS.ExternalCachesDirectoryPath);

  for (let i = 0; i < results.length; i++) {
    await RNFS.unlink(results[i].path);
  }
}

export {
  GetPhotos,
  RemovePhotos,
  addPhoto,
  getFirstPossibleFileName,
  clearCache,
  addPhotoToCache,
};
