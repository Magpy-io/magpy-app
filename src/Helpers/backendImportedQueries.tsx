import axios, {AxiosResponse} from 'axios';

let path: string = '';

let UserToken = '';
let ServerToken = '';

export function SetPath(path_p: string) {
    if (typeof path_p !== 'string') {
        throw new Error('path_p parameter a string');
    }

    path = path_p;
}

export function GetUserToken(): string {
    if (!UserToken) {
        throw new ErrorNoUserToken();
    }
    return UserToken;
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
};

type ErrorBadRequest = 'BAD_REQUEST';
type ErrorServerError = 'SERVER_ERROR';
type ErrorInvalidCredentials = 'INVALID_CREDENTIALS';
type ErrorEmailTaken = 'EMAIL_TAKEN';
type ErrorInvalidEmail = 'INVALID_EMAIL';
type ErrorInvalidName = 'INVALID_NAME';
type ErrorInvalidPassword = 'INVALID_PASSWORD';
type ErrorInvalidIpAddress = 'INVALID_IP_ADDRESS';
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

export type EndpointMethodsResponseType<T, U> = Promise<T | ServerResponseError<U>>;

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

export async function register(
    data: RegisterRequestData
): EndpointMethodsResponseType<RegisterResponseData, RegisterResponseErrorTypes> {
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

export async function login(
    data: LoginRequestData
): EndpointMethodsResponseType<LoginResponseData, LoginResponseErrorTypes> {
    try {
        const response = await axios.post(routes.loginUser(), data);
        UserToken = extractToken(response);
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// WhoAmI
export type WhoAmIRequestData = {};

export type WhoAmIResponseData = ServerResponseData<{
    user: {_id: string; email: string};
}>;

export type WhoAmIResponseErrorTypes = ErrorsAuthorization;

export async function whoAmI(
    data: WhoAmIRequestData
): EndpointMethodsResponseType<WhoAmIResponseData, WhoAmIResponseErrorTypes> {
    verifyHasUserToken();
    try {
        const response = await axios.post(routes.whoAmI(), data, userAuthorizationObject());
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// GetMyServerInfo
export type GetMyServerInfoRequestData = {};

export type GetMyServerInfoResponseData = ServerResponseData<{
    server: {_id: string; name: string; ip: string};
}>;

export type GetMyServerInfoResponseErrorTypes = ErrorNoAssociatedServer | ErrorsAuthorization;

export async function getMyServerInfo(
    data: GetMyServerInfoRequestData
): EndpointMethodsResponseType<
    GetMyServerInfoResponseData,
    GetMyServerInfoResponseErrorTypes
> {
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
    | ErrorInvalidKeyFormat
    | ErrorsAuthorization;

export async function registerServer(
    data: RegisterServerRequestData
): EndpointMethodsResponseType<RegisterServerRequestData, RegisterServerResponseErrorTypes> {
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

export async function getServerToken(
    data: GetServerTokenRequestData
): EndpointMethodsResponseType<GetServerTokenResponseData, GetServerTokenResponseErrorTypes> {
    try {
        const response = await axios.post(routes.getServerToken(), data);
        ServerToken = extractToken(response);
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

// GetServerInfo
export type GetServerInfoRequestData = {};

export type GetServerInfoResponseData = ServerResponseData<{
    server: {_id: string; name: string; owner: string};
}>;

export type GetServerInfoResponseErrorTypes = ErrorsAuthorization;

export async function getServerInfo(
    data: GetServerInfoRequestData
): EndpointMethodsResponseType<GetServerInfoResponseData, GetServerInfoResponseErrorTypes> {
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
