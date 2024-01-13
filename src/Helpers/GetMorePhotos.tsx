import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import {GetPhotos} from '~/Helpers/GetGalleryPhotos';
import * as Queries from '~/Helpers/Queries';
import {PhotoType} from '~/Helpers/types';

type GetMorePhotosReturnType = {
    photos: PhotoType[];
    nextOffset: number;
    endReached: boolean;
};

async function GetMorePhotosLocal(
    n: number,
    offset: number
): Promise<GetMorePhotosReturnType> {
    let foundAnyPhotoNotInServer = false;
    let photosFromDevice = {
        edges: new Array<PhotoIdentifier>(),
        endReached: false,
    };
    let photosExistInServer: Queries.GetPhotosByPathResponseType | undefined;

    let totalOffset = offset;

    while (!foundAnyPhotoNotInServer && !photosFromDevice.endReached) {
        photosFromDevice = await GetPhotos(n, totalOffset);
        // photosExistInServer = await Queries.GetPhotosByPathPost({
        //     paths: photosFromDevice.edges.map(edge => edge.node.image.uri),
        //     photoType: 'data',
        // });

        photosExistInServer = await Queries.GetPhotosByPathPost({
            photosData: photosFromDevice.edges.map(edge => {
                return {
                    path: edge.node.image.uri,
                    size: edge.node.image.fileSize,
                    date: edge.node.timestamp,
                };
            }),
            photoType: 'data',
        });

        console.log('photosExistInServer', photosExistInServer);

        if (!photosExistInServer.ok) {
            console.log(photosExistInServer.errorCode);
            return {
                photos: [],
                nextOffset: offset,
                endReached: false,
            };
        }

        if (
            photosExistInServer.data.photos.length != 0 &&
            photosExistInServer.data.photos.every(v => v.exists)
        ) {
            totalOffset += n;
        } else {
            foundAnyPhotoNotInServer = true;
        }
    }

    if (!foundAnyPhotoNotInServer) {
        return {photos: [], nextOffset: totalOffset, endReached: true};
    }

    const photosNotInServer = photosFromDevice.edges.filter((edge, index) => {
        return !(photosExistInServer as typeof photosExistInServer & {ok: true}).data.photos[
            index
        ].exists;
    });

    const photos = photosNotInServer.map((edge, index) => {
        const photo = edge.node;
        const photoObject: PhotoType = {
            inDevice: true,
            inServer: false,
            image: {
                fileSize: photo.image.fileSize ?? 0,
                fileName: photo.image.filename ?? '',
                height: photo.image.height,
                width: photo.image.width,
                path: photo.image.uri,
                pathCache: '',
                image64: '',
            },
            id: `local_${photo.image.uri}`,
            album: photo.group_name,
            created: new Date(photo.timestamp * 1000).toJSON(),
            modified: new Date(((photo as any).modified as number) * 1000).toJSON(),
            syncDate: '',
            type: photo.type,
            isLoading: false,
            loadingPercentage: 0,
        };
        return photoObject;
    });

    return {
        photos: photos,
        nextOffset: n + totalOffset,
        endReached: photosFromDevice.endReached,
    };
}

async function GetMorePhotosServer(
    n: number,
    offset: number
): Promise<GetMorePhotosReturnType> {
    const photosData = await Queries.GetPhotosPost({
        number: n,
        offset: offset,
        photoType: 'data',
    });

    if (!photosData.ok) {
        console.log(photosData.errorCode);
        return {
            photos: [],
            nextOffset: offset,
            endReached: false,
        };
    }

    if (photosData.data.photos.length == 0) {
        return {
            photos: [],
            nextOffset: n + offset,
            endReached: photosData.data.endReached,
        };
    }

    const filesExist = await Promise.all(
        photosData.data.photos.map(photo => {
            return RNFS.exists(photo.meta.clientPath);
        })
    );

    const ids = [];
    for (let i = 0; i < filesExist.length; i++) {
        if (!filesExist[i]) {
            ids.push(photosData.data.photos[i].id);
        }
    }

    const images64Formated: Array<string> = [];

    if (ids.length == 0) {
        images64Formated.length = photosData.data.photos.length;
        images64Formated.fill('');
    } else {
        const images64Res = await Queries.GetPhotosByIdPost({
            ids: ids,
            photoType: 'thumbnail',
        });

        if (!images64Res.ok) {
            console.log(images64Res.errorCode);
            return {
                photos: [],
                nextOffset: offset,
                endReached: false,
            };
        }

        const images64 = images64Res.data.photos;

        let j = 0;
        for (let i = 0; i < filesExist.length; i++) {
            if (filesExist[i]) {
                images64Formated.push('');
            } else {
                const currentImage64 = images64[j];
                if (currentImage64.exists) {
                    images64Formated.push(currentImage64.photo?.image64);
                }
                j++;
            }
        }
    }

    const photos = photosData.data.photos.map((photo, index: number) => {
        const photoObject: PhotoType = {
            inDevice: filesExist[index],
            inServer: true,
            image: {
                fileSize: photo.meta.fileSize,
                fileName: photo.meta.name,
                height: photo.meta.height,
                width: photo.meta.width,
                path: photo.meta.clientPath,
                pathCache: '',
                image64: filesExist[index]
                    ? ''
                    : `data:image/jpeg;base64,${images64Formated[index]}`,
            },
            id: photo.id,
            album: '',
            created: photo.meta.date,
            modified: '',
            syncDate: photo.meta.syncDate,
            type: '',
            isLoading: false,
            loadingPercentage: 0,
        };
        return photoObject;
    });

    return {
        photos: photos,
        nextOffset: n + offset,
        endReached: photosData.data.endReached,
    };
}

export {GetMorePhotosLocal, GetMorePhotosServer};
