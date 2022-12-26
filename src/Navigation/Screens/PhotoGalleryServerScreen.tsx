import React, { useState, useEffect } from "react";

import PhotoGrid from "~/Components/PhotoGrid";

import * as Queries from "~/Helpers/Queries";
import { PhotoType } from "~/Helpers/types";

import RNFS from "react-native-fs";

type PhotoGalleryProps = {};

export default function PhotoGalleryScreen(props: PhotoGalleryProps) {
  console.log("Render PhotoGalleryServerScreen");
  useEffect(() => {}, []);

  async function GetMorePhotos(n: number, offset: number) {
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
    const images64Formated: string[] = [];
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

  return <PhotoGrid loadMore={GetMorePhotos} />;
}
