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
};

type ErrorBadRequest = 'BAD_REQUEST';
type ErrorServerError = 'SERVER_ERROR';
type ErrorAuthorizationBackendFailed = 'AUTHORIZATION_BACKEND_FAILED';
type ErrorAuthorizationBackendExpired = 'AUTHORIZATION_BACKEND_EXPIRED';
type ErrorBackendServerUnreachable = 'BACKEND_SERVER_UNREACHABLE';
type ErrorPathExists = 'PATH_EXISTS';
type ErrorIdNotFound = 'ID_NOT_FOUND';
type ErrorUserNotAllowed = 'USER_NOT_ALLOWED';
type ErrorServerNotClaimed = 'SERVER_NOT_CLAIMED';
type ErrorInvalidPartNumber = 'INVALID_PART_NUMBER';
type ErrorServerAlreadyClaimed = 'SERVER_ALREADY_CLAIMED';
type ErrorPhotoTransferNotFound = 'PHOTO_TRANSFER_NOT_FOUND';
type ErrorMissingParts = 'MISSING_PARTS';
type ErrorPhotoExists = 'PHOTO_EXISTS';
type ErrorPhotoSizeExceeded = 'PHOTO_SIZE_EXCEEDED';
type ErrorAuthorizationMissing = 'AUTHORIZATION_MISSING';
type ErrorAuthorizationWrongFormat = 'AUTHORIZATION_WRONG_FORMAT';
type ErrorAuthorizationFailed = 'AUTHORIZATION_FAILED';
type ErrorAuthorizationExpired = 'AUTHORIZATION_EXPIRED';

type ErrorsAuthorization =
    | ErrorAuthorizationFailed
    | ErrorAuthorizationMissing
    | ErrorAuthorizationExpired
    | ErrorAuthorizationWrongFormat;

export type ServerResponseMessage = {
    ok: true;
    message: string;
};

export type ServerResponseData<T> = {
    ok: true;
    data: T;
};

export type ServerResponseError<Errors> = {
    ok: false;
    message: string;
    errorCode: Errors | ErrorBadRequest | ErrorServerError;
};

export type EndpointMethodsResponseType<T, U> = T | ServerResponseError<U>;

export type PhotoTypes = 'data' | 'thumbnail' | 'compressed' | 'original';

export type Photo = {
    id: string;
    meta: {
        name: string;
        fileSize: number;
        width: number;
        height: number;
        date: string;
        syncDate: string;
        serverPath: string;
        clientPath: string;
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
    photos: Photo[];
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
    photos: Array<{id: string; exists: false} | {id: string; exists: true; photo: Photo}>;
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
    photo: Photo;
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
    paths: string[];
    photoType: PhotoTypes;
};

export type GetPhotosByPathResponseData = ServerResponseData<{
    number: string;
    photos: Array<{path: string; exists: false} | {path: string; exists: true; photo: Photo}>;
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
};

export type AddPhotoResponseData = ServerResponseData<{
    photo: Photo;
}>;

export type AddPhotoResponseErrorTypes =
    | ErrorPhotoExists
    | ErrorServerNotClaimed
    | ErrorsAuthorization;

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
};

export type AddPhotoInitResponseData = ServerResponseData<{
    id: string;
}>;

export type AddPhotoInitResponseErrorTypes =
    | ErrorPhotoExists
    | ErrorServerNotClaimed
    | ErrorsAuthorization;

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

export type AddPhotoPartResponseData = ServerResponseData<{
    lenReceived: string;
    lenWaiting: string;
    photo: Photo;
}>;

export type AddPhotoPartResponseErrorTypes =
    | ErrorPhotoSizeExceeded
    | ErrorMissingParts
    | ErrorPhotoTransferNotFound
    | ErrorPhotoExists
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
};

export type UpdatePhotoPathResponseData = ServerResponseMessage;

export type UpdatePhotoPathResponseErrorTypes =
    | ErrorIdNotFound
    | ErrorPathExists
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
