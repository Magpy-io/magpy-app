import { AxiosResponse } from "axios";

let UserToken = "";
let ServerToken = "";

export function GetUserToken(): string {
  if (!UserToken) {
    throw new ErrorNoUserToken();
  }
  return UserToken;
}

export function SetUserToken(token: string) {
  if (typeof token !== "string") {
    throw new Error("token parameter must be a string");
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
  if (typeof token !== "string") {
    throw new Error("token parameter must be a string");
  }
  ServerToken = token;
}

export function HasServerToken(): boolean {
  if (ServerToken) {
    return true;
  }
  return false;
}

export function userAuthorizationObject() {
  return {
    headers: {
      "x-authorization": `Bearer ${UserToken}`,
    },
  };
}

export function verifyHasUserToken() {
  if (!UserToken) {
    throw new ErrorNoUserToken();
  }
}

export function serverAuthorizationObject() {
  return {
    headers: {
      "x-authorization": `Bearer ${ServerToken}`,
    },
  };
}

export function verifyHasServerToken() {
  if (!ServerToken) {
    throw new ErrorNoServerToken();
  }
}

export function extractToken(response: AxiosResponse<any, any>) {
  return response.headers["x-authorization"].toString().split(" ")[1];
}

export class ErrorNoUserToken extends Error {
  constructor() {
    super();
    this.message = "You need a user token before making any requests";
  }
}

export class ErrorNoServerToken extends Error {
  constructor() {
    super();
    this.message = "You need a server token before making any requests";
  }
}
