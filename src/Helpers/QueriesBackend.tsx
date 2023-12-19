import axios, {AxiosResponse} from 'axios';

import {ErrorBackendUnreachable, ErrorNoUserToken} from '~/Helpers/ExceptionTypes';

export {ErrorBackendUnreachable, ErrorNoUserToken};

const host = '192.168.0.15';
const port = '8001';

let UserToken = '';

export function HasUserToken(): boolean {
    if (UserToken) {
        return true;
    }
    return false;
}

export function GetUserToken(): string {
    if (!UserToken) {
        throw new ErrorNoUserToken();
    }
    return UserToken;
}

const path = () => {
    return `http://${host}:${port}/`;
};

const routes = {
    registerUser: () => {
        return path() + 'register/';
    },
    loginUser: () => {
        return path() + 'login/';
    },
    whoAmI: () => {
        return path() + 'whoami/';
    },
    getMyServerInfo: () => {
        return path() + 'getMyServerInfo/';
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
    verifyHasToken();
    try {
        const response = await axios.post(routes.whoAmI(), data, authorizationObject());
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
    verifyHasToken();
    try {
        const response = await axios.post(
            routes.getMyServerInfo(),
            data,
            authorizationObject()
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

function authorizationObject() {
    return {
        headers: {
            Authorization: `Bearer ${UserToken}`,
        },
    };
}

function verifyHasToken() {
    if (!UserToken) {
        throw new ErrorNoUserToken();
    }
}
