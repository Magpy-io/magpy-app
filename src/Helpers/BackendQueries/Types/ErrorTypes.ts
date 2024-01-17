export type ErrorBadRequest = "BAD_REQUEST";
export type ErrorServerError = "SERVER_ERROR";
export type ErrorInvalidCredentials = "INVALID_CREDENTIALS";
export type ErrorEmailTaken = "EMAIL_TAKEN";
export type ErrorInvalidEmail = "INVALID_EMAIL";
export type ErrorInvalidName = "INVALID_NAME";
export type ErrorInvalidPassword = "INVALID_PASSWORD";
export type ErrorInvalidIpAddress = "INVALID_IP_ADDRESS";
export type ErrorInvalidPort = "INVALID_PORT";
export type ErrorInvalidServerName = "INVALID_SERVER_NAME";
export type ErrorInvalidKeyFormat = "INVALID_KEY_FORMAT";
export type ErrorNoAssociatedServer = "NO_ASSOCIATED_SERVER";
export type ErrorAuthorizationFailed = "AUTHORIZATION_FAILED";
export type ErrorAuthorizationMissing = "AUTHORIZATION_MISSING";
export type ErrorAuthorizationExpired = "AUTHORIZATION_EXPIRED";
export type ErrorAuthorizationWrongFormat = "AUTHORIZATION_WRONG_FORMAT";

export type ErrorsAuthorization =
  | ErrorAuthorizationFailed
  | ErrorAuthorizationMissing
  | ErrorAuthorizationExpired
  | ErrorAuthorizationWrongFormat;

export type ErrorCodes =
  | ErrorBadRequest
  | ErrorServerError
  | ErrorInvalidCredentials
  | ErrorEmailTaken
  | ErrorInvalidEmail
  | ErrorInvalidName
  | ErrorInvalidPassword
  | ErrorInvalidIpAddress
  | ErrorInvalidServerName
  | ErrorInvalidKeyFormat
  | ErrorNoAssociatedServer
  | ErrorAuthorizationFailed
  | ErrorAuthorizationMissing
  | ErrorAuthorizationExpired
  | ErrorAuthorizationWrongFormat
  | ErrorInvalidPort;
