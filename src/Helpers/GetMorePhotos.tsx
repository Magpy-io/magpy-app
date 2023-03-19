import { PhotoIdentifier } from "@react-native-camera-roll/camera-roll";
import { GetPhotos } from "~/Helpers/GetGalleryPhotos";
import { PhotoType } from "~/Helpers/types";
import * as Queries from "~/Helpers/Queries";
import RNFS from "react-native-fs";

async function GetMorePhotosLocal(n: number, offset: number) {
  let foundAnyPhotoNotInServer = false;
  let photosFromDevice = {
    edges: new Array<PhotoIdentifier>(),
    endReached: false,
  };
  let photosExistInServer: Array<{
    exists: boolean;
    path: string;
    photo: any;
  }>;

  let totalOffset = offset;

  while (!foundAnyPhotoNotInServer && !photosFromDevice.endReached) {
    photosFromDevice = await GetPhotos(n, totalOffset);

    const queryReturn = await Queries.getPhotosExist(
      photosFromDevice.edges.map((edge) => edge.node.image.uri)
    );

    photosExistInServer = queryReturn.data.photosExist;

    if (
      photosExistInServer.length != 0 &&
      photosExistInServer.every((v) => v.exists)
    ) {
      totalOffset += n;
    } else {
      foundAnyPhotoNotInServer = true;
    }
  }

  if (!foundAnyPhotoNotInServer) {
    return { photos: [], nextOffset: totalOffset, endReached: true };
  }

  const photosNotInServer = photosFromDevice.edges.filter((edge, index) => {
    return !photosExistInServer[index].exists;
  });

  const photos = photosNotInServer.map((edge, index) => {
    const photo = edge.node;
    const photoObject: PhotoType = {
      inDevice: true,
      inServer: false,
      image: {
        fileSize: photo.image.fileSize ?? 0,
        fileName: photo.image.filename ?? "",
        height: photo.image.height,
        width: photo.image.width,
        path: photo.image.uri,
        image64: "",
        image64Full: "",
      },
      id: `local_${photo.image.uri}`,
      album: photo.group_name,
      created: new Date(photo.timestamp).toJSON(),
      modified: (photo as any).modified,
      syncDate: "",
      type: photo.type,
    };
    return photoObject;
  });

  return {
    photos: photos,
    nextOffset: n + totalOffset,
    endReached: photosFromDevice.endReached,
  };
}

async function GetMorePhotosServer(n: number, offset: number) {
  const photosData = await Queries.getPhotosDataN(n, offset);

  const filesExist = await Promise.all(
    photosData.data.photos.map((photo: any) => {
      return RNFS.exists(photo.clientPath);
    })
  );

  const ids = [];
  for (let i = 0; i < filesExist.length; i++) {
    if (!filesExist[i]) {
      ids.push(photosData.data.photos[i].id);
    }
  }
  const images64Res = await Queries.getPhotosByIds(ids);

  const images64 = images64Res.data.photos;
  const images64Formated: Array<string> = [];
  let j = 0;
  for (let i = 0; i < filesExist.length; i++) {
    if (filesExist[i]) {
      images64Formated.push("");
    } else {
      images64Formated.push(images64[j++].photo.image64);
    }
  }

  const photos = photosData.data.photos.map((photo: any, index: number) => {
    const photoObject: PhotoType = {
      inDevice: filesExist[index],
      inServer: true,
      image: {
        fileSize: photo.fileSize,
        fileName: photo.name,
        height: photo.height,
        width: photo.width,
        path: photo.clientPath,
        image64: filesExist[index]
          ? ""
          : `data:image/jpeg;base64,${images64Formated[index]}`,
        image64Full: "",
      },
      id: photo.id,
      album: "",
      created: photo.date,
      modified: "",
      syncDate: photo.syncDate,
      type: "",
    };
    return photoObject;
  });
  return {
    photos: photos,
    nextOffset: n + offset,
    endReached: photosData.data.endReached,
  };
}

export { GetMorePhotosLocal, GetMorePhotosServer };
