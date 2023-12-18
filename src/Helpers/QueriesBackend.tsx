import axios from 'axios';

import {ErrorBackendUnreachable} from '~/Helpers/ExceptionTypes';

const host = '192.168.0.15';
const port = '8001';

const path = () => {
    return `http://${host}:${port}/`;
};

const routes = {
    registerUser: () => {
        return path() + 'register/';
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
    ok: boolean;
    message: string;
};

export type ServerResponseError<Errors> = {
    ok: boolean;
    message: string;
    errorCode: Errors | ErrorBadRequest | ErrorServerError;
};

export type ServerResponseData<T> = {
    ok: boolean;
    data: T;
};

export type RegisterRequestDataType = {
    email: string;
    name: string;
    password: string;
};

export type RegisterResponseError = ServerResponseError<
    ErrorEmailTaken | ErrorInvalidEmail | ErrorInvalidName | ErrorInvalidPassword
>;

export async function register(
    data: RegisterRequestDataType
): Promise<ServerResponseMessage | RegisterResponseError> {
    try {
        const response = await axios.post(routes.registerUser(), data);
        return response.data;
    } catch (err: any) {
        return handleAxiosError(err);
    }
}

function handleAxiosError(err: any): ServerResponseError<any> {
    if (err.response) {
        return err.response.data;
    } else if (err.request) {
        throw new ErrorBackendUnreachable('Backend unreachable');
    } else {
        throw err;
    }
}
