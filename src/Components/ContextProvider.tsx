import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useReducer,
    useRef,
} from 'react';

import {NativeEventEmitter, NativeModules} from 'react-native';
const {MainModule} = NativeModules;

import {ErrorCodes} from 'react-native-delete-media';
import RNFS from 'react-native-fs';

import {PhotoType} from '~/Helpers/types';

import {GetMorePhotosLocal, GetMorePhotosServer} from '~/Helpers/GetMorePhotos';

import {RemovePhotos, addPhoto, addPhotoToCache, clearCache} from '~/Helpers/GetGalleryPhotos';
import * as Queries from '~/Helpers/Queries';

import {Action, Actions, GlobalReducer, initialState} from '~/Components/ContextReducer';

type contextType = {
    photosLocal: Array<PhotoType>;
    photosServer: Array<PhotoType>;
    onRefreshLocal: () => Promise<void>;
    onRefreshServer: () => Promise<void>;
    fetchMoreLocal: () => Promise<void>;
    fetchMoreServer: () => Promise<void>;
    RequestFullPhotoServer: (photo: PhotoType) => Promise<void>;
    RequestCroppedPhotosServer: (photos: PhotoType[]) => Promise<void>;
    addPhotosLocal: (photos: PhotoType[]) => Promise<void>;
    addPhotosServer: (photos: PhotoType[]) => Promise<void>;
    deletePhotosLocal: (photos: PhotoType[]) => Promise<void>;
    deletePhotosServer: (photos: PhotoType[]) => Promise<void>;
};

const ITEMS_TO_LOAD_PER_END_REACHED_LOCAL = 3000;

const ITEMS_TO_LOAD_PER_END_REACHED_SERVER = 3000;

const addSinglePhotoServer = async (photo: PhotoType, dispatch: React.Dispatch<Action>) => {
    const res = await RNFS.readFile(photo.image.path, 'base64');

    const result = await Queries.addPhotoWithProgress(
        {
            name: photo.image.fileName,
            fileSize: photo.image.fileSize,
            width: photo.image.width,
            height: photo.image.height,
            date: new Date(photo.created).toJSON(),
            path: photo.image.path,
            image64: res,
        },
        (p: number, t: number) => {
            dispatch({
                type: Actions.updatePhotoProgress,
                payload: {photo: photo, isLoading: true, p: (p + 1) / t},
            });
        }
    );

    if (!result.ok) {
        console.log(result.errorCode);
        return;
    }

    dispatch({
        type: Actions.addPhotoServer,
        payload: {photo: photo},
    });
};

const addSinglePhotoLocal = async (photo: PhotoType, dispatch: React.Dispatch<Action>) => {
    const result = await Queries.getPhotoWithProgress(photo.id, (p: number, t: number) => {
        dispatch({
            type: Actions.updatePhotoProgressServer,
            payload: {photo: photo, isLoading: true, p: (p + 1) / t},
        });
    });

    if (!result.ok) {
        console.log(result.errorCode);
        return;
    }

    const image64 = result.data.photo.image64;
    const newUri = await addPhoto(photo, image64);

    photo.image.path = newUri;
    dispatch({type: Actions.addPhotoLocal, payload: {photo: photo}});
    dispatch({
        type: Actions.updatePhotoProgressServer,
        payload: {photo: photo, isLoading: false, p: 0},
    });

    const result1 = await Queries.UpdatePhotoPathPost({id: photo.id, path: newUri});

    if (!result1.ok) {
        console.log(result1.errorCode);
        return;
    }
};

const AppContext = createContext<contextType | undefined>(undefined);

type PropsType = {
    children: any;
};

const ContextProvider = (props: PropsType) => {
    const [state, dispatch] = useReducer(GlobalReducer, initialState);

    const photosUploading = useRef([] as PhotoType[]);
    const isPhotosUploading = useRef(false);

    const photosDownloading = useRef([] as PhotoType[]);
    const isPhotosDownloading = useRef(false);

    const isrefreshPhotosAddingServerRunning = useRef(false);

    const intervalIdForRefreshPhotosAddingServer = useRef<ReturnType<typeof setInterval>>();

    const intervalFunction = () => {
        //console.log("interval");
        refreshPhotosAddingServer?.();
    };

    const intervalTimer = 5000;

    useEffect(() => {
        intervalIdForRefreshPhotosAddingServer.current = setInterval(
            intervalFunction,
            intervalTimer
        );

        return () => {
            clearInterval(intervalIdForRefreshPhotosAddingServer.current);
        };
    }, []);

    useEffect(() => {
        const emitter = new NativeEventEmitter();
        const subscription = emitter.addListener('PhotoUploaded', () => {
            console.log('event');
            refreshPhotosAddingServer?.();

            if (intervalIdForRefreshPhotosAddingServer.current != null) {
                clearInterval(intervalIdForRefreshPhotosAddingServer.current);
                intervalIdForRefreshPhotosAddingServer.current = setInterval(
                    intervalFunction,
                    intervalTimer
                );
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const onRefreshLocal = useCallback(async () => {
        try {
            const newPhotos = await GetMorePhotosLocal(ITEMS_TO_LOAD_PER_END_REACHED_LOCAL, 0);
            dispatch({
                type: Actions.setNewPhotosLocal,
                payload: {newPhotos: newPhotos},
            });
        } catch (err) {
            console.log(err);
        }
    }, []);

    const onRefreshServer = useCallback(async () => {
        try {
            await clearCache();
            const newPhotos = await GetMorePhotosServer(
                ITEMS_TO_LOAD_PER_END_REACHED_SERVER,
                0
            );

            dispatch({
                type: Actions.setNewPhotosServer,
                payload: {newPhotos: newPhotos},
            });
        } catch (err) {
            console.log(err);
        }
    }, []);

    const fetchMoreLocal = useCallback(async () => {
        try {
            if (state.endReachedLocal) {
                return;
            }

            const newPhotos = await GetMorePhotosLocal(
                ITEMS_TO_LOAD_PER_END_REACHED_LOCAL,
                state.nextOffsetLocal
            );

            dispatch({
                type: Actions.addToPhotosLocal,
                payload: {newPhotos: newPhotos},
            });
        } catch (err) {
            console.log(err);
        }
    }, [state]);

    const fetchMoreServer = useCallback(async () => {
        try {
            if (state.endReachedServer) {
                return;
            }

            const newPhotos = await GetMorePhotosServer(
                ITEMS_TO_LOAD_PER_END_REACHED_SERVER,
                state.nextOffsetServer
            );

            dispatch({
                type: Actions.addToPhotosServer,
                payload: {newPhotos: newPhotos},
            });
        } catch (err) {
            console.log(err);
        }
    }, [state]);

    const RequestFullPhotoServer = useCallback(async (photo: PhotoType) => {
        if (photo.image.pathCache) {
            return;
        }
        try {
            const result = await Queries.GetPhotosByIdPost({
                ids: [photo.id],
                photoType: 'compressed',
            });

            if (!result.ok) {
                console.log(result.errorCode);
                return;
            }

            if (!result.data.photos[0].exists) {
                console.log(`Photo with id ${photo.id} not found`);
                console.log(result);
                return;
            }

            const pathCache = await addPhotoToCache(
                photo.image.fileName,
                result.data.photos[0].photo.image64
            );
            photo.image.pathCache = pathCache;
            dispatch({
                type: Actions.addFullPhotoById,
                payload: {photo: photo},
            });
        } catch (err) {
            console.log(err);
        }
    }, []);

    const RequestCroppedPhotosServer = useCallback(async (photos: PhotoType[]) => {
        try {
            const ids = photos.map(photo => photo.id);
            const result = await Queries.GetPhotosByIdPost({ids: ids, photoType: 'thumbnail'});

            if (!result.ok) {
                console.log(result.errorCode);
                return;
            }

            const photosWithImage64 = result.data.photos;
            const photosWithImage64Filtered = photosWithImage64.filter(
                image64 => image64.exists
            );

            const images64 = photosWithImage64Filtered.map(v => {
                const vWithTypeAssertion = v as typeof v & {exists: true};
                return {
                    id: vWithTypeAssertion.photo?.id,
                    image64: vWithTypeAssertion.photo?.image64,
                };
            });

            dispatch({
                type: Actions.addCroppedPhotos,
                payload: {images64: images64},
            });
        } catch (err) {
            console.log(err);
        }
    }, []);

    const addPhotosLocal = useCallback(async (photos: PhotoType[]) => {
        try {
            for (let i = 0; i < photos.length; i++) {
                if (!photos[i].isLoading && !photos[i].inDevice) {
                    dispatch({
                        type: Actions.updatePhotoProgressServer,
                        payload: {photo: photos[i], isLoading: true, p: 0},
                    });
                    photosDownloading.current.push(photos[i]);
                }
            }

            if (isPhotosDownloading.current) {
                return;
            }

            while (photosDownloading.current.length != 0) {
                isPhotosDownloading.current = true;
                const photo = photosDownloading.current.shift() as PhotoType;
                try {
                    await addSinglePhotoLocal(photo, dispatch);
                } catch (err) {
                    console.log(`error while downloading photo with id ${photo.id}`);
                    console.log(err);
                }
            }
            isPhotosDownloading.current = false;
        } catch (err) {
            console.log(err);
        }
    }, []);

    const addPhotosServer = useCallback(async (photos: PhotoType[]) => {
        try {
            await MainModule.startSendingMediaService(
                photos.map(p => {
                    return {
                        id: p.id,
                        name: p.image.fileName,
                        date: new Date(p.created).toJSON(),
                        path: p.image.path,
                        width: p.image.width,
                        height: p.image.height,
                        size: p.image.fileSize,
                    };
                })
            );

            // for (let i = 0; i < photos.length; i++) {
            //   if (!photos[i].isLoading) {
            //     dispatch({
            //       type: Actions.updatePhotoProgress,
            //       payload: { photo: photos[i], isLoading: true, p: 0 },
            //     });
            //   }
            // }
        } catch (err) {
            console.log(err);
        }

        return;
        try {
            for (let i = 0; i < photos.length; i++) {
                if (!photos[i].isLoading) {
                    dispatch({
                        type: Actions.updatePhotoProgress,
                        payload: {photo: photos[i], isLoading: true, p: 0},
                    });
                    photosUploading.current.push(photos[i]);
                }
            }

            if (isPhotosUploading.current) {
                return;
            }

            while (photosUploading.current.length != 0) {
                isPhotosUploading.current = true;
                const photo = photosUploading.current.shift() as PhotoType;
                try {
                    await addSinglePhotoServer(photo, dispatch);
                } catch (err) {
                    console.log(`error while posting photo with id ${photo.id}`);
                    console.log(err);
                }
            }
            isPhotosUploading.current = false;
        } catch (err) {
            console.log(err);
        }
    }, []);

    const deletePhotosLocal = useCallback(async (photos: PhotoType[]) => {
        try {
            const uris = photos.map(photo => photo.image.path);
            let photosRemoved = true;

            try {
                await RemovePhotos(uris);
            } catch (err: any) {
                photosRemoved = false;
                const code: ErrorCodes = err.code;

                if (code != 'ERROR_USER_REJECTED') {
                    throw err;
                }
            }

            if (photosRemoved) {
                dispatch({
                    type: Actions.deletePhotosLocalFromLocal,
                    payload: {photos: photos},
                });
            }
        } catch (err) {
            console.log(err);
        }
    }, []);

    const deletePhotosServer = useCallback(async (photos: PhotoType[]) => {
        try {
            const ids = photos.map(photo => photo.id);

            dispatch({
                type: Actions.deletePhotosServer,
                payload: {ids: ids},
            });

            const result = await Queries.DeletePhotosByIdPost({ids: ids});

            if (!result.ok) {
                console.log(result.errorCode);
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }, []);

    const refreshPhotosAddingServer = useCallback(async () => {
        try {
            if (isrefreshPhotosAddingServerRunning.current) {
                return;
            }

            isrefreshPhotosAddingServerRunning.current = true;

            const serviceState = await MainModule.getServiceState();

            //console.log("service is", serviceState);

            if (serviceState == 'DESTROYED' || serviceState == 'STARTUP') {
                return;
            }

            const ids = await MainModule.getIds();
            const currentIndex = await MainModule.getCurrentIndex();

            dispatch({
                type: Actions.updatePhotosFromService,
                payload: {ids, currentIndex},
            });

            if (serviceState == 'INACTIVE' || serviceState == 'FAILED') {
                await MainModule.stopSendingMediaService();
                dispatch({
                    type: Actions.clearAllLoadingLocal,
                    payload: {},
                });

                if (serviceState == 'FAILED') {
                    //TODO display toast message
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            isrefreshPhotosAddingServerRunning.current = false;
        }
    }, []);

    const value = {
        photosLocal: state.photosLocal,
        photosServer: state.photosServer,
        onRefreshLocal: onRefreshLocal,
        onRefreshServer: onRefreshServer,
        fetchMoreLocal: fetchMoreLocal,
        fetchMoreServer: fetchMoreServer,
        RequestFullPhotoServer: RequestFullPhotoServer,
        RequestCroppedPhotosServer: RequestCroppedPhotosServer,
        addPhotosLocal: addPhotosLocal,
        addPhotosServer: addPhotosServer,
        deletePhotosLocal: deletePhotosLocal,
        deletePhotosServer: deletePhotosServer,
    };

    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

function useMainContext() {
    return useContext(AppContext) as contextType;
}

export {ContextProvider, useMainContext};
