import axios, {AxiosResponse} from 'axios';

export function SetPath(path_p: string) {
    if (typeof path_p !== 'string') {
        throw new Error('path_p parameter must be astring');
    }

    if (path_p[path_p.length - 1] != '/') {
        path_p += '/';
    }

    path = path_p;
}

let path: string = '';

let UserToken = '';

export function GetUserToken(): string {
    if (!UserToken) {
        throw new ErrorNoUserToken();
    }
    return UserToken;
}

export function SetUserToken(token: string) {
    if (typeof token !== 'string') {
        throw new Error('token parameter must be a string');
    }
    UserToken = token;
}

export function HasUserToken(): boolean {
    if (UserToken) {
        return true;
    }
    return false;
}

function checkPathExists() {
    if (!path) {
        throw new ErrorPathNotSet();
    }
}

const routes = {
    whoAmI: () => {
        checkPathExists();
        return path + 'whoami/';
    },
    getPhotos: () => {
        checkPathExists();
        return path + 'getPhotos/';
    },
    getPhotosById: () => {
        checkPathExists();
        return path + 'getPhotosById/';
    },
    getPhotoPartById: () => {
        checkPathExists();
        return path + 'getPhotoPartById/';
    },
    getPhotosByPath: () => {
        checkPathExists();
        return path + 'getPhotosByPath/';
    },
    getNumberPhotos: () => {
        checkPathExists();
        return path + 'getNumberPhotos/';
    },
    addPhoto: () => {
        checkPathExists();
        return path + 'addPhoto/';
    },
    addPhotoInit: () => {
        checkPathExists();
        return path + 'addPhotoInit/';
    },
    addPhotoPart: () => {
        checkPathExists();
        return path + 'addPhotoPart/';
    },
    updatePhotoPath: () => {
        checkPathExists();
        return path + 'updatePhotoPath/';
    },
    deletePhotosById: () => {
        checkPathExists();
        return path + 'deletePhotosById/';
    },
    claimServer: () => {
        checkPathExists();
        return path + 'claimServer/';
    },
    getToken: () => {
        checkPathExists();
        return path + 'getToken/';
    },
    unclaimServer: () => {
        checkPathExists();
        return path + 'unclaimServer/';
    },
    getServerInfo: () => {
        checkPathExists();
        return path + 'getServerInfo/';
    },
    updateServerName: () => {
        checkPathExists();
        return path + 'updateServerName/';
    },
    updateServerPath: () => {
        checkPathExists();
        return path + 'updateServerPath/';
    },
    getLastWarning: () => {
        checkPathExists();
        return path + 'getLastWarning/';
    },
};

type ErrorBadRequest = 'BAD_REQUEST';
type ErrorServerError = 'SERVER_ERROR';
type ErrorAuthorizationBackendFailed = 'AUTHORIZATION_BACKEND_FAILED';
type ErrorAuthorizationBackendExpired = 'AUTHORIZATION_BACKEND_EXPIRED';
type ErrorBackendServerUnreachable = 'BACKEND_SERVER_UNREACHABLE';
type ErrorIdNotFound = 'ID_NOT_FOUND';
type ErrorUserNotAllowed = 'USER_NOT_ALLOWED';
type ErrorServerNotClaimed = 'SERVER_NOT_CLAIMED';
type ErrorInvalidPartNumber = 'INVALID_PART_NUMBER';
type ErrorServerAlreadyClaimed = 'SERVER_ALREADY_CLAIMED';
type ErrorPhotoTransferNotFound = 'PHOTO_TRANSFER_NOT_FOUND';
type ErrorMissingParts = 'MISSING_PARTS';
type ErrorPhotoSizeExceeded = 'PHOTO_SIZE_EXCEEDED';
type ErrorAuthorizationMissing = 'AUTHORIZATION_MISSING';
type ErrorAuthorizationWrongFormat = 'AUTHORIZATION_WRONG_FORMAT';
type ErrorAuthorizationFailed = 'AUTHORIZATION_FAILED';
type ErrorAuthorizationExpired = 'AUTHORIZATION_EXPIRED';
type ErrorCouldNotGetRequestAddress = 'COULD_NOT_GET_REQUEST_ADDRESS';
type ErrorRequestNotFromLoopback = 'REQUEST_NOT_FROM_LOOPBACK';
type ErrorPathAccessDenied = 'PATH_ACCESS_DENIED';
type ErrorPathFolderDoesNotExist = 'PATH_FOLDER_DOES_NOT_EXIST';
type ErrorInvalidName = 'INVALID_NAME';

type ErrorsNotFromLocal = ErrorCouldNotGetRequestAddress | ErrorRequestNotFromLoopback;

type ErrorsAuthorization =
    | ErrorAuthorizationFailed
    | ErrorAuthorizationMissing
    | ErrorAuthorizationExpired
    | ErrorAuthorizationWrongFormat;

export type ErrorCodes =
    | ErrorBadRequest
    | ErrorServerError
    | ErrorAuthorizationBackendFailed
    | ErrorAuthorizationBackendExpired
    | ErrorBackendServerUnreachable
    | ErrorIdNotFound
    | ErrorUserNotAllowed
    | ErrorServerNotClaimed
    | ErrorInvalidPartNumber
    | ErrorServerAlreadyClaimed
    | ErrorPhotoTransferNotFound
    | ErrorMissingParts
    | ErrorPhotoSizeExceeded
    | ErrorAuthorizationMissing
    | ErrorAuthorizationWrongFormat
    | ErrorAuthorizationFailed
    | ErrorAuthorizationExpired
    | ErrorCouldNotGetRequestAddress
    | ErrorRequestNotFromLoopback
    | ErrorPathAccessDenied
    | ErrorPathFolderDoesNotExist
    | ErrorInvalidName;

export type WarningFormat<Code, Data> = {code: Code; data: Data};

export type WarningDataTypes = WarningPhotosNotOnDiskDeletedType;

export type WarningPhotosNotOnDiskDeletedDataType = {
    photosDeleted: Array<APIPhoto>;
};
export type WarningPhotosNotOnDiskDeletedType = WarningFormat<
    'PHOTOS_NOT_ON_DISK_DELETED',
    WarningPhotosNotOnDiskDeletedDataType
>;

export type ServerResponseMessage = {
    ok: true;
    message: string;
    warning: boolean;
};

export type DataTypeFrom<T> = T extends {data: infer D} ? D : never;

export type ServerResponseData<T> = {
    ok: true;
    data: T;
    warning: boolean;
};

export type ServerResponseError<Errors> = {
    ok: false;
    message: string;
    errorCode: Errors | ErrorBadRequest | ErrorServerError;
    warning: boolean;
};

export type EndpointMethodsResponseType<T, U> = T | ServerResponseError<U>;

export const PhotoTypesArray = ['data', 'thumbnail', 'compressed', 'original'] as const;

export type PhotoTypes = (typeof PhotoTypesArray)[number];

export type APIPhoto = {
    id: string;
    meta: {
        name: string;
        fileSize: number;
        width: number;
        height: number;
        date: string;
        syncDate: string;
        serverPath: string;
        clientPaths: Array<{deviceUniqueId: string; path: string}>;
    };
    image64: string;
};

// WhoAmI
export type WhoAmIRequestData = void;

export type WhoAmIResponseData = ServerResponseData<{
    user: {id: string};
}>;

export type WhoAmIResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export type WhoAmIResponseType = EndpointMethodsResponseType<
    WhoAmIResponseData,
    WhoAmIResponseErrorTypes
>;

export async function WhoAmIPost(data: WhoAmIRequestData): Promise<WhoAmIResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(routes.whoAmI(), data, userAuthorizationObject());
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// GetPhotos
export type GetPhotosRequestData = {
    number: number;
    offset: number;
    photoType: PhotoTypes;
};

export type GetPhotosResponseData = ServerResponseData<{
    endReached: boolean;
    number: number;
    photos: APIPhoto[];
}>;

export type GetPhotosResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export type GetPhotosResponseType = EndpointMethodsResponseType<
    GetPhotosResponseData,
    GetPhotosResponseErrorTypes
>;

export async function GetPhotosPost(
    data: GetPhotosRequestData
): Promise<GetPhotosResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(routes.getPhotos(), data, userAuthorizationObject());
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// GetPhotosById
export type GetPhotosByIdRequestData = {
    ids: string[];
    photoType: PhotoTypes;
};

export type GetPhotosByIdResponseData = ServerResponseData<{
    number: number;
    photos: Array<{id: string; exists: false} | {id: string; exists: true; photo: APIPhoto}>;
}>;

export type GetPhotosByIdResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export type GetPhotosByIdResponseType = EndpointMethodsResponseType<
    GetPhotosByIdResponseData,
    GetPhotosByIdResponseErrorTypes
>;

export async function GetPhotosByIdPost(
    data: GetPhotosByIdRequestData
): Promise<GetPhotosByIdResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(
            routes.getPhotosById(),
            data,
            userAuthorizationObject()
        );
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// GetPhotoPartById
export type GetPhotoPartByIdRequestData = {
    id: string;
    part: number;
};

export type GetPhotoPartByIdResponseData = ServerResponseData<{
    photo: APIPhoto;
    part: number;
    totalNbOfParts: number;
}>;

export type GetPhotoPartByIdResponseErrorTypes =
    | ErrorInvalidPartNumber
    | ErrorIdNotFound
    | ErrorServerNotClaimed
    | ErrorsAuthorization;

export type GetPhotoPartByIdResponseType = EndpointMethodsResponseType<
    GetPhotoPartByIdResponseData,
    GetPhotoPartByIdResponseErrorTypes
>;

export async function GetPhotoPartByIdPost(
    data: GetPhotoPartByIdRequestData
): Promise<GetPhotoPartByIdResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(
            routes.getPhotoPartById(),
            data,
            userAuthorizationObject()
        );
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// GetPhotosByPath
export type GetPhotosByPathRequestData = {
    photosData: Array<{path: string; size: number; date: string}>;
    photoType: PhotoTypes;
    deviceUniqueId: string;
};

export type GetPhotosByPathResponseData = ServerResponseData<{
    number: number;
    photos: Array<
        {path: string; exists: false} | {path: string; exists: true; photo: APIPhoto}
    >;
}>;

export type GetPhotosByPathResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export type GetPhotosByPathResponseType = EndpointMethodsResponseType<
    GetPhotosByPathResponseData,
    GetPhotosByPathResponseErrorTypes
>;

export async function GetPhotosByPathPost(
    data: GetPhotosByPathRequestData
): Promise<GetPhotosByPathResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(
            routes.getPhotosByPath(),
            data,
            userAuthorizationObject()
        );
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// GetNumberPhotos
export type GetNumberPhotosRequestData = void;

export type GetNumberPhotosResponseData = ServerResponseData<{
    number: number;
}>;

export type GetNumberPhotosResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export type GetNumberPhotosResponseType = EndpointMethodsResponseType<
    GetNumberPhotosResponseData,
    GetNumberPhotosResponseErrorTypes
>;

export async function GetNumberPhotosPost(
    data: GetNumberPhotosRequestData
): Promise<GetNumberPhotosResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(
            routes.getNumberPhotos(),
            data,
            userAuthorizationObject()
        );
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// AddPhoto
export type AddPhotoRequestData = {
    name: string;
    fileSize: number;
    width: number;
    height: number;
    path: string;
    date: string;
    image64: string;
    deviceUniqueId: string;
};

export type AddPhotoResponseData = ServerResponseData<{
    photo: APIPhoto;
}>;

export type AddPhotoResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export type AddPhotoResponseType = EndpointMethodsResponseType<
    AddPhotoResponseData,
    AddPhotoResponseErrorTypes
>;

export async function AddPhotoPost(data: AddPhotoRequestData): Promise<AddPhotoResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(routes.addPhoto(), data, userAuthorizationObject());
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}
// AddPhotoInit
export type AddPhotoInitRequestData = {
    name: string;
    fileSize: number;
    width: number;
    height: number;
    path: string;
    date: string;
    image64Len: number;
    deviceUniqueId: string;
};

export type AddPhotoInitResponseData = ServerResponseData<{
    id: string;
}>;

export type AddPhotoInitResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export type AddPhotoInitResponseType = EndpointMethodsResponseType<
    AddPhotoInitResponseData,
    AddPhotoInitResponseErrorTypes
>;

export async function AddPhotoInitPost(
    data: AddPhotoInitRequestData
): Promise<AddPhotoInitResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(
            routes.addPhotoInit(),
            data,
            userAuthorizationObject()
        );
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}
// AddPhotoPart
export type AddPhotoPartRequestData = {
    id: string;
    partNumber: number;
    partSize: number;
    photoPart: string;
};

export type AddPhotoPartResponseData = ServerResponseData<
    | {
          lenReceived: number;
          lenWaiting: number;
          done: false;
      }
    | {
          lenReceived: number;
          lenWaiting: number;
          done: true;
          photo: APIPhoto;
      }
>;

export type AddPhotoPartResponseErrorTypes =
    | ErrorPhotoSizeExceeded
    | ErrorMissingParts
    | ErrorPhotoTransferNotFound
    | ErrorServerNotClaimed
    | ErrorsAuthorization;

export type AddPhotoPartResponseType = EndpointMethodsResponseType<
    AddPhotoPartResponseData,
    AddPhotoPartResponseErrorTypes
>;

export async function AddPhotoPartPost(
    data: AddPhotoPartRequestData
): Promise<AddPhotoPartResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(
            routes.addPhotoPart(),
            data,
            userAuthorizationObject()
        );
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}
// UpdatePhotoPath
export type UpdatePhotoPathRequestData = {
    id: string;
    path: string;
    deviceUniqueId: string;
};

export type UpdatePhotoPathResponseData = ServerResponseMessage;

export type UpdatePhotoPathResponseErrorTypes =
    | ErrorIdNotFound
    | ErrorServerNotClaimed
    | ErrorsAuthorization;

export type UpdatePhotoPathResponseType = EndpointMethodsResponseType<
    UpdatePhotoPathResponseData,
    UpdatePhotoPathResponseErrorTypes
>;

export async function UpdatePhotoPathPost(
    data: UpdatePhotoPathRequestData
): Promise<UpdatePhotoPathResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(
            routes.updatePhotoPath(),
            data,
            userAuthorizationObject()
        );
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}
// DeletePhotosById
export type DeletePhotosByIdRequestData = {
    ids: string[];
};

export type DeletePhotosByIdResponseData = ServerResponseData<{
    deletedIds: string[];
}>;

export type DeletePhotosByIdResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export type DeletePhotosByIdResponseType = EndpointMethodsResponseType<
    DeletePhotosByIdResponseData,
    DeletePhotosByIdResponseErrorTypes
>;

export async function DeletePhotosByIdPost(
    data: DeletePhotosByIdRequestData
): Promise<DeletePhotosByIdResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(
            routes.deletePhotosById(),
            data,
            userAuthorizationObject()
        );
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}
// ClaimServer
export type ClaimServerRequestData = {
    userToken: string;
};

export type ClaimServerResponseData = ServerResponseMessage;

export type ClaimServerResponseErrorTypes =
    | ErrorBackendServerUnreachable
    | ErrorServerAlreadyClaimed
    | ErrorAuthorizationBackendFailed
    | ErrorAuthorizationBackendExpired;

export type ClaimServerResponseType = EndpointMethodsResponseType<
    ClaimServerResponseData,
    ClaimServerResponseErrorTypes
>;

export async function ClaimServerPost(
    data: ClaimServerRequestData
): Promise<ClaimServerResponseType> {
    try {
        const response = await axios.post(routes.claimServer(), data);
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}
// GetToken
export type GetTokenRequestData = {
    userToken: string;
};

export type GetTokenResponseData = ServerResponseMessage;

export type GetTokenResponseErrorTypes =
    | ErrorBackendServerUnreachable
    | ErrorServerNotClaimed
    | ErrorUserNotAllowed
    | ErrorAuthorizationBackendFailed
    | ErrorAuthorizationBackendExpired;

export type GetTokenResponseType = EndpointMethodsResponseType<
    GetTokenResponseData,
    GetTokenResponseErrorTypes
>;

export async function GetTokenPost(data: GetTokenRequestData): Promise<GetTokenResponseType> {
    try {
        const response = await axios.post(routes.getToken(), data);
        UserToken = extractToken(response);
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// UnclaimServer
export type UnclaimServerRequestData = void;

export type UnclaimServerResponseData = ServerResponseMessage;

export type UnclaimServerResponseErrorTypes =
    | ErrorsNotFromLocal
    | ErrorBackendServerUnreachable;

export type UnclaimServerResponseType = EndpointMethodsResponseType<
    UnclaimServerResponseData,
    UnclaimServerResponseErrorTypes
>;

export async function UnclaimServerPost(
    data: UnclaimServerRequestData
): Promise<UnclaimServerResponseType> {
    try {
        const response = await axios.post(routes.unclaimServer(), data);
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// GetServerInfo
export type GetServerInfoRequestData = void;

export type GetServerInfoResponseData = ServerResponseData<{
    storagePath: string;
    serverName: string;
    owner: {name: string; email: string} | null;
}>;

export type GetServerInfoResponseErrorTypes =
    | ErrorsNotFromLocal
    | ErrorBackendServerUnreachable;

export type GetServerInfoResponseType = EndpointMethodsResponseType<
    GetServerInfoResponseData,
    GetServerInfoResponseErrorTypes
>;

export async function GetServerInfoPost(
    data: GetServerInfoRequestData
): Promise<GetServerInfoResponseType> {
    try {
        const response = await axios.post(routes.getServerInfo(), data);
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// UpdateServerName
export type UpdateServerNameRequestData = {name?: string};

export type UpdateServerNameResponseData = ServerResponseMessage;

export type UpdateServerNameResponseErrorTypes =
    | ErrorInvalidName
    | ErrorsNotFromLocal
    | ErrorBackendServerUnreachable;

export type UpdateServerNameResponseType = EndpointMethodsResponseType<
    UpdateServerNameResponseData,
    UpdateServerNameResponseErrorTypes
>;

export async function UpdateServerNamePost(
    data: UpdateServerNameRequestData
): Promise<UpdateServerNameResponseType> {
    try {
        const response = await axios.post(routes.updateServerName(), data);
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// UpdateServerPath
export type UpdateServerPathRequestData = {path?: string};

export type UpdateServerPathResponseData = ServerResponseMessage;

export type UpdateServerPathResponseErrorTypes =
    | ErrorPathFolderDoesNotExist
    | ErrorPathAccessDenied
    | ErrorsNotFromLocal;

export type UpdateServerPathResponseType = EndpointMethodsResponseType<
    UpdateServerPathResponseData,
    UpdateServerPathResponseErrorTypes
>;

export async function UpdateServerPathPost(
    data: UpdateServerPathRequestData
): Promise<UpdateServerPathResponseType> {
    try {
        const response = await axios.post(routes.updateServerPath(), data);
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// GetLastWarning
export type GetLastWarningRequestData = void;

export type GetLastWarningResponseData = ServerResponseData<{
    warning: WarningDataTypes | null;
}>;

export type GetLastWarningResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export type GetLastWarningResponseType = EndpointMethodsResponseType<
    GetLastWarningResponseData,
    GetLastWarningResponseErrorTypes
>;

export async function GetLastWarningPost(
    data: GetLastWarningRequestData
): Promise<GetLastWarningResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(
            routes.getLastWarning(),
            data,
            userAuthorizationObject()
        );
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// Functions
function handleAxiosError(err: any): ServerResponseError<any> {
    if (err.response) {
        return err.response.data;
    } else if (err.request) {
        throw new ErrorBackendUnreachable();
    } else {
        throw err;
    }
}

function extractToken(response: AxiosResponse<any, any>) {
    return response.headers['authorization'].toString().split(' ')[1];
}

function userAuthorizationObject() {
    return {
        headers: {
            Authorization: `Bearer ${UserToken}`,
        },
    };
}

function verifyHasUserToken() {
    if (!UserToken) {
        throw new ErrorNoUserToken();
    }
}

export class ErrorBackendUnreachable extends Error {
    constructor() {
        super();
        this.message = 'Server is unreachable';
    }
}

export class ErrorNoUserToken extends Error {
    constructor() {
        super();
        this.message = 'You need a user token before making any requests';
    }
}

export class ErrorPathNotSet extends Error {
    constructor() {
        super();
        this.message = 'You need to set a path before runing any requests';
    }
}
