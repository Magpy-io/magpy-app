import { AxiosResponse } from 'axios';

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

export function userAuthorizationObject() {
  return {
    headers: {
      'x-authorization': `Bearer ${UserToken}`,
    },
  };
}

export function verifyHasUserToken() {
  if (!UserToken) {
    throw new ErrorNoUserToken();
  }
}

export function extractToken(response: AxiosResponse<any, any>) {
  return response.headers['x-authorization'].toString().split(' ')[1];
}

export class ErrorNoUserToken extends Error {
  constructor() {
    super();
    this.message = 'You need a user token before making any requests';
  }
}
