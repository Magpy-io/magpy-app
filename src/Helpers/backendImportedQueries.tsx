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
let ServerToken = '';

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

export function GetServerToken(): string {
    if (!ServerToken) {
        throw new ErrorNoServerToken();
    }
    return ServerToken;
}

export function SetServerToken(token: string) {
    if (typeof token !== 'string') {
        throw new Error('token parameter must be a string');
    }
    ServerToken = token;
}

export function HasServerToken(): boolean {
    if (ServerToken) {
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
    registerUser: () => {
        checkPathExists();
        return path + 'register/';
    },
    loginUser: () => {
        checkPathExists();
        return path + 'login/';
    },
    whoAmI: () => {
        checkPathExists();
        return path + 'whoami/';
    },
    getMyServerInfo: () => {
        checkPathExists();
        return path + 'getMyServerInfo/';
    },
    registerServer: () => {
        checkPathExists();
        return path + 'registerServer/';
    },
    getServerToken: () => {
        checkPathExists();
        return path + 'getServerToken/';
    },
    getServerInfo: () => {
        checkPathExists();
        return path + 'getServerInfo/';
    },
    deleteServer: () => {
        checkPathExists();
        return path + 'deleteServer/';
    },
    updateServerData: () => {
        checkPathExists();
        return path + 'updateServerData/';
    },
};

type ErrorBadRequest = 'BAD_REQUEST';
type ErrorServerError = 'SERVER_ERROR';
type ErrorInvalidCredentials = 'INVALID_CREDENTIALS';
type ErrorEmailTaken = 'EMAIL_TAKEN';
type ErrorInvalidEmail = 'INVALID_EMAIL';
type ErrorInvalidName = 'INVALID_NAME';
type ErrorInvalidPassword = 'INVALID_PASSWORD';
type ErrorInvalidIpAddress = 'INVALID_IP_ADDRESS';
type ErrorInvalidServerName = 'INVALID_SERVER_NAME';
type ErrorInvalidKeyFormat = 'INVALID_KEY_FORMAT';
type ErrorNoAssociatedServer = 'NO_ASSOCIATED_SERVER';
type ErrorAuthorizationFailed = 'AUTHORIZATION_FAILED';
type ErrorAuthorizationMissing = 'AUTHORIZATION_MISSING';
type ErrorAuthorizationExpired = 'AUTHORIZATION_EXPIRED';
type ErrorAuthorizationWrongFormat = 'AUTHORIZATION_WRONG_FORMAT';

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

// Register
export type RegisterRequestData = {
    email: string;
    name: string;
    password: string;
};

export type RegisterResponseData = ServerResponseMessage;

export type RegisterResponseErrorTypes =
    | ErrorEmailTaken
    | ErrorInvalidEmail
    | ErrorInvalidName
    | ErrorInvalidPassword;

export type RegisterResponseType = EndpointMethodsResponseType<
    RegisterResponseData,
    RegisterResponseErrorTypes
>;
export async function registerPost(data: RegisterRequestData): Promise<RegisterResponseType> {
    try {
        const response = await axios.post(routes.registerUser(), data);
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// Login
export type LoginRequestData = {
    email: string;
    password: string;
};

export type LoginResponseData = ServerResponseMessage;

export type LoginResponseErrorTypes = ErrorInvalidCredentials;

export type LoginResponseType = EndpointMethodsResponseType<
    LoginResponseData,
    LoginResponseErrorTypes
>;

export async function loginPost(data: LoginRequestData): Promise<LoginResponseType> {
    try {
        const response = await axios.post(routes.loginUser(), data);
        UserToken = extractToken(response);
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// WhoAmI
export type WhoAmIRequestData = void;

export type WhoAmIResponseData = ServerResponseData<{
    user: {_id: string; email: string};
}>;

export type WhoAmIResponseErrorTypes = ErrorsAuthorization;

export type WhoAmIResponseType = EndpointMethodsResponseType<
    WhoAmIResponseData,
    WhoAmIResponseErrorTypes
>;

export async function whoAmIPost(data: WhoAmIRequestData): Promise<WhoAmIResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(routes.whoAmI(), data, userAuthorizationObject());
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// GetMyServerInfo
export type GetMyServerInfoRequestData = void;

export type GetMyServerInfoResponseData = ServerResponseData<{
    server: {_id: string; name: string; ip: string};
}>;

export type GetMyServerInfoResponseErrorTypes = ErrorNoAssociatedServer | ErrorsAuthorization;

export type GetMyServerInfoResponseType = EndpointMethodsResponseType<
    GetMyServerInfoResponseData,
    GetMyServerInfoResponseErrorTypes
>;

export async function getMyServerInfoPost(
    data: GetMyServerInfoRequestData
): Promise<GetMyServerInfoResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(
            routes.getMyServerInfo(),
            data,
            userAuthorizationObject()
        );
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// RegisterServer
export type RegisterServerRequestData = {
    name: string;
    ipAddress: string;
    serverKey: string;
};

export type RegisterServerResponseData = ServerResponseData<{
    server: {_id: string};
}>;

export type RegisterServerResponseErrorTypes =
    | ErrorInvalidIpAddress
    | ErrorInvalidServerName
    | ErrorInvalidKeyFormat
    | ErrorsAuthorization;

export type RegisterServerResponseType = EndpointMethodsResponseType<
    RegisterServerResponseData,
    RegisterServerResponseErrorTypes
>;

export async function registerServerPost(
    data: RegisterServerRequestData
): Promise<RegisterServerResponseType> {
    verifyHasUserToken();
    try {
        const response = await axios.post(
            routes.registerServer(),
            data,
            userAuthorizationObject()
        );
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// GetServerToken
export type GetServerTokenRequestData = {
    id: string;
    key: string;
};

export type GetServerTokenResponseData = ServerResponseMessage;

export type GetServerTokenResponseErrorTypes = ErrorInvalidCredentials;

export type GetServerTokenResponseType = EndpointMethodsResponseType<
    GetServerTokenResponseData,
    GetServerTokenResponseErrorTypes
>;

export async function getServerTokenPost(
    data: GetServerTokenRequestData
): Promise<GetServerTokenResponseType> {
    try {
        const response = await axios.post(routes.getServerToken(), data);
        ServerToken = extractToken(response);
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// GetServerInfo
export type GetServerInfoRequestData = void;

export type GetServerInfoResponseData = ServerResponseData<{
    server: {
        _id: string;
        name: string;
        owner: {_id: string; name: string; email: string} | null;
    };
}>;

export type GetServerInfoResponseErrorTypes = ErrorsAuthorization;

export type GetServerInfoResponseType = EndpointMethodsResponseType<
    GetServerInfoResponseData,
    GetServerInfoResponseErrorTypes
>;

export async function getServerInfoPost(
    data: GetServerInfoRequestData
): Promise<GetServerInfoResponseType> {
    verifyHasServerToken();
    try {
        const response = await axios.post(
            routes.getServerInfo(),
            data,
            serverAuthorizationObject()
        );
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// DeleteServer
export type DeleteServerRequestData = void;

export type DeleteServerResponseData = ServerResponseMessage;

export type DeleteServerResponseErrorTypes = ErrorsAuthorization;

export type DeleteServerResponseType = EndpointMethodsResponseType<
    DeleteServerResponseData,
    DeleteServerResponseErrorTypes
>;

export async function DeleteServerPost(
    data: DeleteServerRequestData
): Promise<DeleteServerResponseType> {
    verifyHasServerToken();
    try {
        const response = await axios.post(
            routes.deleteServer(),
            data,
            serverAuthorizationObject()
        );
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// UpdateServerData
export type UpdateServerDataRequestData = {
    name?: string;
    ipAddress?: string;
};

export type UpdateServerDataResponseData = ServerResponseMessage;

export type UpdateServerDataResponseErrorTypes =
    | ErrorInvalidIpAddress
    | ErrorInvalidServerName
    | ErrorsAuthorization;

export type UpdateServerDataResponseType = EndpointMethodsResponseType<
    UpdateServerDataResponseData,
    UpdateServerDataResponseErrorTypes
>;

export async function UpdateServerDataPost(
    data: UpdateServerDataRequestData
): Promise<UpdateServerDataResponseType> {
    verifyHasServerToken();
    try {
        const response = await axios.post(
            routes.updateServerData(),
            data,
            serverAuthorizationObject()
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

function serverAuthorizationObject() {
    return {
        headers: {
            Authorization: `Bearer ${ServerToken}`,
        },
    };
}

function verifyHasServerToken() {
    if (!ServerToken) {
        throw new ErrorNoServerToken();
    }
}

export class ErrorBackendUnreachable extends Error {
    constructor() {
        super();
        this.message = 'Backend server is unreachable';
    }
}

export class ErrorNoUserToken extends Error {
    constructor() {
        super();
        this.message = 'You need to log in first to get a user token';
    }
}

export class ErrorNoServerToken extends Error {
    constructor() {
        super();
        this.message = 'You need to connect server first to get a server token';
    }
}

export class ErrorPathNotSet extends Error {
    constructor() {
        super();
        this.message = 'You need to set a path before runing any requests';
    }
}
